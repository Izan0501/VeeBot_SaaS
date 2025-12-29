from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
import shutil
import os
import asyncio 
from datetime import datetime
from typing import List
from pymongo import MongoClient
from dotenv import load_dotenv

# --- IMPORTACIONES DE SERVICIOS PROPIOS ---
from security import get_password_hash, verify_password, create_access_token, SECRET_KEY, ALGORITHM
from services import extract_text_from_pdf, process_and_store_cv, analyze_candidate_with_groq, get_ai_score
from database import insert_candidate, get_all_candidates_from_db, delete_candidate_by_id

load_dotenv()

app = FastAPI(title="RecruitAI API")

# --- CONFIGURACIÓN MONGO DB ---
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(mongo_uri)
db_name = os.getenv("DB_NAME", "recruitai_db")
db = mongo_client[db_name]
users_collection = db["users"]

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- SEGURIDAD ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfileUpdate(BaseModel):
    name: str
    role: str
    min_score: int
    auto_reject: bool

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

# ==========================================
# 1. RUTAS DE AUTENTICACIÓN Y PERFIL
# ==========================================

@app.post("/auth/register", status_code=201)
async def register_user(user: UserAuth):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    hashed_pwd = get_password_hash(user.password)
    new_user = {
        "email": user.email,
        "password": hashed_pwd,
        "name": "Usuario",
        "role": "Reclutador",
        "settings": {
            "min_score": 70,
            "auto_reject": False
        },
        "created_at": datetime.now()
    }
    users_collection.insert_one(new_user)
    return {"message": "Usuario creado exitosamente"}

@app.post("/auth/login", response_model=Token)
async def login_for_access_token(user: UserAuth):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    settings = current_user.get("settings", {})
    return {
        "email": current_user.get("email"),
        "name": current_user.get("name", "Usuario"),
        "role": current_user.get("role", "Reclutador"),
        "min_score": settings.get("min_score", 70),
        "auto_reject": settings.get("auto_reject", False)
    }

@app.put("/auth/me")
def update_user_profile(data: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    new_settings = {
        "min_score": data.min_score,
        "auto_reject": data.auto_reject,
        "model": "llama-3.3-70b-versatile"
    }

    users_collection.update_one(
        {"email": current_user["email"]},
        {
            "$set": {
                "name": data.name,
                "role": data.role,
                "settings": new_settings
            }
        }
    )
    return {"message": "Perfil actualizado correctamente"}

@app.put("/auth/change-password")
def change_password(data: PasswordChange, current_user: dict = Depends(get_current_user)):
    if not verify_password(data.current_password, current_user["password"]):
        raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
    
    new_hashed_pwd = get_password_hash(data.new_password)
    users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"password": new_hashed_pwd}}
    )
    return {"message": "Contraseña actualizada exitosamente"}

# ==========================================
# 2. RUTAS DE SUBIDA (CORE)
# ==========================================

@app.post("/upload")
async def upload_cvs(
    files: List[UploadFile] = File(...), 
    current_user: dict = Depends(get_current_user)
):
    # Configuración del usuario
    user_settings = current_user.get("settings", {"min_score": 70, "auto_reject": False})
    threshold = user_settings.get("min_score", 70)
    auto_reject = user_settings.get("auto_reject", False)
    selected_model = "llama-3.3-70b-versatile" # Modelo actualizado

    os.makedirs("uploads", exist_ok=True)
    
    # SEMÁFORO: Controla la concurrencia (3 a la vez)
    sem = asyncio.Semaphore(3) 

    async def process_single_file(file):
        async with sem:
            try:
                file_location = f"uploads/{file.filename}"
                content = await file.read()
                with open(file_location, "wb") as buffer:
                    buffer.write(content)
                
                text = extract_text_from_pdf(file_location)
                candidate_name = file.filename.replace(".pdf", "").replace("_", " ").title()
                
                # Pinecone
                process_and_store_cv(text, file.filename, candidate_name)

                print(f"🤖 Analizando: {candidate_name} (Umbral: {threshold})...")
                
                # Groq IA (en thread aparte para no bloquear)
                ai_analysis = await asyncio.to_thread(get_ai_score, text, selected_model)
                
                # Lógica de Negocio
                score_val = ai_analysis.get("score", 0)
                status_final = "Bajo Potencial"

                if score_val >= threshold:
                    status_final = "Alto Potencial"
                elif score_val >= (threshold - 20):
                    status_final = "Medio Potencial"
                else:
                    if auto_reject:
                        status_final = "Rechazado Automático"
                    else:
                        status_final = "Bajo Potencial"

                # Guardar en DB con skills y summary
                insert_candidate(
                    file.filename, 
                    candidate_name, 
                    text, 
                    {**ai_analysis, "status": status_final}
                ) 
                return {"file": file.filename, "status": "success"}

            except Exception as e:
                print(f"❌ Error en {file.filename}: {e}")
                return {"file": file.filename, "status": "error", "msg": str(e)}

    # Lanzamiento Masivo
    print(f"🚀 Procesando {len(files)} archivos...")
    tasks = [process_single_file(file) for file in files]
    results = await asyncio.gather(*tasks)
    
    success_count = sum(1 for r in results if r["status"] == "success")
    errors = [r["file"] for r in results if r["status"] == "error"]

    if success_count == 0 and len(errors) > 0:
         raise HTTPException(status_code=500, detail=f"Falló todo. Errores: {errors}")

    return {
        "status": "success", 
        "message": f"Procesados {success_count}/{len(files)} CVs.",
        "errors": errors
    }

# ==========================================
# 3. RUTAS DE LECTURA Y CHAT (RAG)
# ==========================================

# --- ¡ESTE ES EL ENDPOINT QUE TE FALTABA! ---
@app.get("/candidates")
def get_candidates(current_user: dict = Depends(get_current_user)):
    try:
        # Recupera los datos de la base de datos para mostrarlos en el Dashboard
        return get_all_candidates_from_db()
    except Exception as e:
        print(f"Error DB: {e}")
        raise HTTPException(status_code=500, detail="Error conectando a la base de datos")

@app.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: str, current_user: dict = Depends(get_current_user)):
    success = delete_candidate_by_id(candidate_id)
    if not success:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")
    return {"status": "success", "message": "Candidato eliminado correctamente"}

@app.post("/analyze")
async def chat_with_recruiter(
    query: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        # 1. Recuperar contexto de la DB
        candidates_list = get_all_candidates_from_db()
        
        # Log para verificar que hay datos
        print(f"DEBUG CHAT: Encontrados {len(candidates_list)} candidatos en la DB.")

        if not candidates_list:
            context_text = "No hay candidatos cargados en la base de datos todavía."
        else:
            context_text = ""
            for c in candidates_list:
                # Recuperar skills de forma segura
                skills = c.get("skills", [])
                if isinstance(skills, list):
                    skills_str = ", ".join(skills)
                else:
                    skills_str = str(skills)

                summary = c.get("summary", "Sin detalles.")
                
                # Construimos el bloque de texto que leerá la IA
                context_text += f"""
                - Candidato: {c['name']}
                  Rol: {c['role']}
                  Score: {c['score']}/100
                  STACK TÉCNICO: [{skills_str}]
                  Resumen: {summary}
                -----------------------------------
                """

        # 2. Enviar a la IA con el contexto inyectado
        response = analyze_candidate_with_groq(query, context_text)
        return {"response": response}

    except Exception as e:
        print(f"Error en chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))