from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, status, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from pathlib import Path
import json
import os
import csv
import io
import re
import asyncio 
from groq import Groq
from datetime import datetime, timedelta
from typing import List
from pymongo import MongoClient
from pypdf import PdfReader
import hmac
import hashlib
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from bson import ObjectId
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from services import cleanup_expired_candidates
from dotenv import load_dotenv
from security import get_password_hash, verify_password, create_access_token, SECRET_KEY, ALGORITHM
from services import extract_text_from_pdf, process_and_store_cv, analyze_candidate_with_groq, get_ai_score
from database import insert_candidate, get_all_candidates_from_db, delete_candidate_by_id

# --- CARGA DE ENTORNO ---
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="VeeBot API - AI Recruiter")

# --- SCHEDULER DE LIMPIEZA AUTOMÁTICA ---
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def start_scheduler():
    # Ejecuta la limpieza una vez al día (cada 24 horas)
    scheduler.add_job(cleanup_expired_candidates, "interval", hours=24)
    scheduler.start()
    print("⏰ Scheduler de limpieza automática activado (Ciclo: 24h)")
    
    # Opcional: Ejecutar una limpieza al arrancar por si estuvo apagado
    cleanup_expired_candidates() 

@app.on_event("shutdown")
async def stop_scheduler():
    scheduler.shutdown()

# --- CONFIGURACIÓN MONGO DB ---
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(mongo_uri)
db_name = os.getenv("DB_NAME", "recruitai_db")
db = mongo_client[db_name]
users_collection = db["users"]
candidates_collection = db["candidates"] # Referencia directa para limpieza

# --- CONFIGURACIÓN SERVICIOS EXTERNOS ---
LEMON_API_KEY = os.getenv("LEMON_API_KEY")
LEMON_STORE_ID = os.getenv("LEMON_STORE_ID")
LEMON_VARIANT_ID = os.getenv("LEMON_VARIANT_ID")
LEMON_WEBHOOK_SECRET = os.getenv("LEMON_WEBHOOK_SECRET")
LEMON_API_URL = os.getenv("LEMON_API_URL", "https://api.lemonsqueezy.com/v1")

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- CONFIGURACIÓN GROQ ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("⚠️ ADVERTENCIA: No se encontró GROQ_API_KEY en el archivo .env")
    
client = Groq(api_key=GROQ_API_KEY)

# --- SEGURIDAD ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# --- MODELOS PYDANTIC ---
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
    
class EmailRequest(BaseModel):
    email: EmailStr

class DirectResetRequest(BaseModel):
    email: EmailStr
    new_password: str

class ReportRequest(BaseModel):
    candidate_id: str
    target_email: EmailStr

class EmailTemplateUpdate(BaseModel):
    templates: dict 

class SendTemplateRequest(BaseModel):
    candidate_id: str
    template_type: str

class ContactFormRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    message: str

class CompareRequest(BaseModel):
    candidate_id_a: str
    candidate_id_b: str

class ChatRequest(BaseModel):
    candidate_id: str
    message: str
    history: List[dict] = []

# --- DEPENDENCIA DE USUARIO ACTUAL ---
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
# 1. RUTAS DE AUTENTICACIÓN
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
        "role": "Free", # Por defecto Free
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
        "role": current_user.get("role", "Free"),
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
                "role": data.role, # Nota: En prod, el rol no debería ser editable por el usuario
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

@app.post("/auth/verify-email")
async def verify_email_exists(data: EmailRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="El correo no está registrado")
    return {"message": "Usuario encontrado", "exists": True}

@app.post("/auth/reset-password-direct")
async def reset_password_direct(data: DirectResetRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    new_hashed_pwd = get_password_hash(data.new_password)
    users_collection.update_one(
        {"email": data.email},
        {"$set": {"password": new_hashed_pwd}}
    )
    return {"message": "Contraseña actualizada. Ya puedes iniciar sesión."}

@app.delete("/auth/me")
async def delete_account(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    role = current_user.get("role", "Free")

    # 1. VALIDACIÓN DE SEGURIDAD (Backend enforcement)
    # Si es Premium, NO dejamos borrar. Debe cancelar en Lemon Squeezy primero.
    if role in ["Premium", "Agency Pro"]:
        raise HTTPException(
            status_code=403, 
            detail="Debes cancelar tu suscripción Premium antes de eliminar tu cuenta para evitar cobros futuros."
        )

    # 2. Borrar Vectores (Pinecone)
    # Importa esta función de services.py
    from services import delete_user_vectors 
    delete_user_vectors(user_id)

    # 3. Borrar Datos (Mongo)
    # Importa esta función de database.py
    from database import delete_full_user_data
    success = delete_full_user_data(user_id, users_collection, candidates_collection)

    if not success:
        raise HTTPException(status_code=500, detail="Error al eliminar los datos del usuario")

    return {"message": "Cuenta eliminada permanentemente. Hasta la vista."}

# ==========================================
# 2. RUTAS DE UPLOAD Y ANÁLISIS
# ==========================================
@app.post("/upload")
async def upload_cvs(
    files: List[UploadFile] = File(...), 
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user["_id"])
    user_settings = current_user.get("settings", {"min_score": 70, "auto_reject": False})
    threshold = user_settings.get("min_score", 70)
    auto_reject = user_settings.get("auto_reject", False)
    selected_model = "llama-3.3-70b-versatile"

    os.makedirs("uploads", exist_ok=True)
    
    # SEMÁFORO DE CONCURRENCIA
    sem = asyncio.Semaphore(10) 

    async def process_single_file(file):
        async with sem:
            try:
                safe_filename = f"{user_id}_{file.filename}"
                file_location = f"uploads/{safe_filename}"
                
                content = await file.read()
                # Escritura en disco
                with open(file_location, "wb") as buffer:
                    buffer.write(content)
                
                # ==============================================================================
                # 1. EXTRACCIÓN ROBUSTA (PARA 2 COLUMNAS) 🧠
                # ==============================================================================
                # En lugar de usar la función externa, lo hacemos aquí para controlar el modo "layout"
                # que ayuda a que el texto de las columnas no se mezcle.
                def robust_extract(pdf_bytes):
                    try:
                        reader = PdfReader(io.BytesIO(pdf_bytes))
                        full_text = []
                        for page in reader.pages:
                            # 'extraction_mode="layout"' preserva espacios visuales (clave para 2 columnas)
                            # Si falla (versiones viejas de pypdf), usa el estándar
                            try:
                                txt = page.extract_text(extraction_mode="layout")
                            except:
                                txt = page.extract_text()
                            if txt:
                                full_text.append(txt)
                        return "\n".join(full_text)
                    except Exception as e:
                        print(f"Error lectura PDF: {e}")
                        return ""

                # Ejecutamos la extracción en un hilo para no bloquear
                text = await asyncio.to_thread(robust_extract, content)
                
                # ==============================================================================
                # 2. CAZADOR DE EMAILS (REGEX V2 - "EL SABUESO") 🐶
                # ==============================================================================
                # Esta regex es más agresiva. Encuentra emails incluso si están pegados a texto
                # Ej: "Contacto:juan@mail.com" -> detecta "juan@mail.com"
                email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                
                # Buscamos TODOS los emails y tomamos el primero
                found_emails = re.findall(email_pattern, text)
                extracted_email = found_emails[0] if found_emails else None
                
                if extracted_email:
                    print(f"✅ Email detectado en {file.filename}: {extracted_email}")
                else:
                    print(f"⚠️ No se encontró email en {file.filename}")
                # ==============================================================================
                
                candidate_name = file.filename.replace(".pdf", "").replace("_", " ").title()
                
                # Pinecone upsert
                process_and_store_cv(text, safe_filename, candidate_name, user_id)

                print(f"🤖 Analizando: {candidate_name}...")
                
                # AI Analysis
                ai_analysis = await asyncio.to_thread(get_ai_score, text, selected_model)
                
                # Lógica de Score y Status
                score_val = ai_analysis.get("score", 0)
                status_final = "Bajo Potencial"
                if score_val >= threshold:
                    status_final = "Alto Potencial"
                elif score_val >= (threshold - 20):
                    status_final = "Medio Potencial"
                else:
                    status_final = "Rechazado Automático" if auto_reject else "Bajo Potencial"

                # 4. GUARDAR EN DB (Con el email extraído)
                insert_candidate(
                    file.filename, 
                    candidate_name, 
                    text, 
                    {
                        **ai_analysis, 
                        "status": status_final,
                        "email": extracted_email # <--- ¡AQUÍ SE GUARDA!
                    },
                    user_id
                ) 
                return {"file": file.filename, "status": "success"}

            except Exception as e:
                print(f"❌ Error en {file.filename}: {e}")
                return {"file": file.filename, "status": "error", "msg": str(e)}

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
# 3. GESTIÓN DE CANDIDATOS Y CHAT
# ==========================================
@app.get("/candidates")
def get_candidates(current_user: dict = Depends(get_current_user)):
    try:
        # Pasamos el ID del usuario para traer SOLO sus datos
        return get_all_candidates_from_db(str(current_user["_id"]))
    except Exception as e:
        print(f"Error DB: {e}")
        raise HTTPException(status_code=500, detail="Error conectando a la base de datos")

@app.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: str, current_user: dict = Depends(get_current_user)):
    # Pasamos el ID para asegurar que borra algo suyo
    success = delete_candidate_by_id(candidate_id, str(current_user["_id"]))
    if not success:
        raise HTTPException(status_code=404, detail="Candidato no encontrado o no tienes permiso")
    return {"status": "success", "message": "Candidato eliminado correctamente"}

@app.post("/analyze")
async def chat_with_recruiter(
    query: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Recuperamos SOLO los candidatos del usuario para el contexto del chat
        candidates_list = get_all_candidates_from_db(str(current_user["_id"]))
        print(f"DEBUG CHAT: Encontrados {len(candidates_list)} candidatos del usuario.")

        if not candidates_list:
            context_text = "El usuario aún no ha cargado candidatos."
        else:
            context_text = ""
            for c in candidates_list:
                skills = c.get("skills", [])
                skills_str = ", ".join(skills) if isinstance(skills, list) else str(skills)
                summary = c.get("summary", "Sin detalles.")
                
                context_text += f"""
                - Candidato: {c['name']}
                  Rol: {c['role']}
                  Score: {c['score']}/100
                  STACK TÉCNICO: [{skills_str}]
                  Resumen: {summary}
                -----------------------------------
                """
        
        response = analyze_candidate_with_groq(query, context_text)
        return {"response": response}

    except Exception as e:
        print(f"Error en chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 3.1 EXPORTAR CANDIDATOS A CSV
# =========================================
@app.get("/export-csv")
async def export_candidates_csv(current_user: dict = Depends(get_current_user)):
    # 1. Obtener candidatos del usuario
    user_id = str(current_user["_id"])
    candidates = get_all_candidates_from_db(user_id)

    if not candidates:
        raise HTTPException(status_code=404, detail="No hay datos para exportar")

    # 2. Crear el archivo CSV en memoria (Buffer)
    output = io.StringIO()
    writer = csv.writer(output)

    # 3. Escribir Encabezados
    writer.writerow(["ID", "Nombre", "Rol Detectado", "Puntaje (0-100)", "Estado", "Fecha Subida", "Skills"])

    # 4. Escribir Filas
    for c in candidates:
        # Formatear skills como string separado por comas
        skills_str = ", ".join(c.get("skills", []))
        
        writer.writerow([
            c.get("id"),
            c.get("name"),
            c.get("role"),
            c.get("score"),
            c.get("status"),
            c.get("date"),
            skills_str
        ])

    # 5. Preparar la descarga
    output.seek(0)
    
    # Convertimos a Bytes para StreamingResponse
    mem = io.BytesIO()
    mem.write(output.getvalue().encode('utf-8-sig')) # utf-8-sig para que Excel abra bien los acentos
    mem.seek(0)
    output.close()

    filename = f"veebot_candidates_{datetime.now().strftime('%Y%m%d')}.csv"
    
    return StreamingResponse(
        mem, 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ==========================================
# 3.2 DEMO DATA (SEED) - LÓGICA DINÁMICA
# ==========================================

@app.post("/seed")
async def seed_demo_data(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # 1. OBTENER TUS REGLAS DE RECLUTAMIENTO ACTUALES
    settings = current_user.get("settings", {})
    threshold = settings.get("min_score", 70)
    auto_reject_enabled = settings.get("auto_reject", False)

    # 2. DEFINIR DATOS BASE (Scores variados)
    raw_candidates = [
        {
            "name": "Sofía Rodriguez",
            "role": "Frontend Developer",
            "score": 92,
            "summary": "Candidata excepcional con 6 años en React y Next.js. Ha liderado equipos y tiene experiencia en arquitecturas escalables.",
            "skills": ["React", "TypeScript", "Tailwind", "Figma", "Redux"],
            "text_preview": "Experiencia demostrable en startups unicornio...",
            "days_ago": 0
        },
        {
            "name": "Marcos Pérez",
            "role": "Backend Developer",
            "score": 85,
            "summary": "Sólido perfil Python/Django. Buena base de algoritmos, aunque le falta un poco de experiencia en microservicios.",
            "skills": ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
            "text_preview": "Desarrollador Backend enfocado en APIs REST...",
            "days_ago": 2
        },
        {
            "name": "Lucía Mendez",
            "role": "Data Scientist",
            "score": 74, 
            "summary": "Perfil académico fuerte (PhD), pero poca experiencia en producción real. Ideal para roles de investigación.",
            "skills": ["Python", "Pandas", "Scikit-Learn", "R", "SQL"],
            "text_preview": "Analista de datos con background matemático...",
            "days_ago": 5
        },
        {
            "name": "Juan Lopez",
            "role": "Full Stack Dev",
            "score": 45, 
            "summary": "Recién graduado de Bootcamp. Tiene los conceptos básicos pero el CV es muy genérico y carece de proyectos complejos.",
            "skills": ["HTML", "CSS", "Javascript", "Git"],
            "text_preview": "Entusiasta de la programación buscando primera oportunidad...",
            "days_ago": 1
        },
        {
            "name": "Carlos Ruiz",
            "role": "DevOps",
            "score": 88, 
            "summary": "Experto en Kubernetes y CI/CD. Perfil muy técnico y directo al grano. Muy valioso para infraestructura.",
            "skills": ["Kubernetes", "Terraform", "Jenkins", "Azure", "Linux"],
            "text_preview": "Ingeniero de confiabilidad del sitio (SRE)...",
            "days_ago": 3
        }
    ]

    processed_candidates = []

    # 3. APLICAR TU LÓGICA DE NEGOCIO A LOS DATOS FALSOS
    for c in raw_candidates:
        score = c["score"]
        status = "Bajo Potencial"

        # Misma lógica que en /upload
        if score >= threshold:
            status = "Alto Potencial"
        elif score >= (threshold - 20):
            status = "Medio Potencial"
        else:
            # Aquí es donde aplica tu configuración de Auto-Reject
            status = "Rechazado Automático" if auto_reject_enabled else "Bajo Potencial"

        processed_candidates.append({
            "user_id": user_id,
            "filename": f"demo_{c['name'].lower().replace(' ', '_')}.pdf",
            "name": c["name"],
            "role": c["role"],
            "score": score,
            "status": status, # <--- Estado calculado dinámicamente
            "summary": c["summary"],
            "skills": c["skills"],
            "text_preview": c["text_preview"],
            "upload_date": datetime.now() - timedelta(days=c["days_ago"])
        })

    try:
        candidates_collection.insert_many(processed_candidates)
        return {"message": "Datos de demostración cargados aplicando tus reglas."}
    except Exception as e:
        print(f"Error seeding: {e}")
        raise HTTPException(status_code=500, detail="Error al generar datos de prueba")

# ==========================================
# 4. PAGOS (LEMON SQUEEZY)
# ==========================================
@app.post("/payments/create-checkout")
async def create_checkout_session(current_user: dict = Depends(get_current_user)):
    if not LEMON_API_KEY or not LEMON_VARIANT_ID:
        raise HTTPException(status_code=500, detail="Configuración de pagos incompleta")

    headers = {
        "Authorization": f"Bearer {LEMON_API_KEY}",
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json"
    }

    # Enviamos datos del usuario para que el Webhook sepa a quién activar después
    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "checkout_data": {
                    "custom": {
                        "user_email": current_user["email"],
                        "user_id": str(current_user["_id"]) 
                    }
                }
            },
            "relationships": {
                "store": {
                    "data": {"type": "stores", "id": LEMON_STORE_ID}
                },
                "variant": {
                    "data": {"type": "variants", "id": LEMON_VARIANT_ID}
                }
            }
        }
    }

    try:
        response = requests.post(f"{LEMON_API_URL}/checkouts", json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return {"checkout_url": data['data']['attributes']['url']}
    except Exception as e:
        print(f"Error Checkout: {e}")
        if 'response' in locals(): print(response.text)
        raise HTTPException(status_code=500, detail="Error al conectar con la pasarela de pago")

@app.post("/payments/webhook")
async def lemon_webhook(request: Request, x_signature: str = Header(None)):
    """
    Maneja los webhooks de Lemon Squeezy buscando custom_data en todas las ubicaciones posibles.
    """
    if not x_signature:
        raise HTTPException(status_code=401, detail="Firma no proporcionada")

    # 1. Validación de Firma
    raw_body = await request.body()
    if not LEMON_WEBHOOK_SECRET:
        print("❌ ERROR: LEMON_WEBHOOK_SECRET no configurado")
        raise HTTPException(status_code=500, detail="Error servidor")

    digest = hmac.new(LEMON_WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(digest, x_signature):
        print("❌ Firma inválida")
        raise HTTPException(status_code=401, detail="Firma inválida")

    # 2. Parsing del JSON
    data = await request.json()
    
    # Obtenemos meta y attributes
    meta = data.get('meta', {})
    event_name = meta.get('event_name')
    attributes = data.get('data', {}).get('attributes', {})
    
    print(f"🔔 Webhook recibido: {event_name}")

    if event_name in ["order_created", "subscription_created", "subscription_payment_success", "subscription_updated"]:
        
        custom_data = None

        # --- ESTRATEGIA DE BÚSQUEDA PROFUNDA ---
        
        # 1. Buscar en ROOT META (Aquí es donde estaba tu dato perdido)
        if 'custom_data' in meta:
            custom_data = meta.get('custom_data')
            print("✅ Custom Data encontrado en 'meta' (Root)")

        # 2. Buscar en ATTRIBUTES (Estándar para orders)
        if not custom_data and 'custom_data' in attributes:
            custom_data = attributes.get('custom_data')
            print("✅ Custom Data encontrado en 'attributes'")

        # 3. Buscar en CHECKOUT_DATA (A veces pasa en test mode)
        if not custom_data:
             checkout_data = attributes.get('checkout_data')
             if checkout_data and 'custom' in checkout_data:
                 custom_data = checkout_data.get('custom')
                 print("✅ Custom Data encontrado en 'checkout_data'")

        print(f"📦 Datos extraídos: {custom_data}")
        
        # --- PROCESAR USUARIO ---
        user_email = None
        customer_id = attributes.get('customer_id')
        
        # Prioridad A: Email desde Custom Data (El email de la cuenta registrada)
        if custom_data and isinstance(custom_data, dict):
            user_email = custom_data.get('user_email')
        
        # Prioridad B: Fallback (El email que escribió al pagar)
        if not user_email:
            user_email = attributes.get('user_email')
            print(f"⚠️ Alerta: Usando email de facturación ({user_email}). Puede no coincidir con el usuario registrado.")

        if user_email:
            # Actualizamos a Premium
            result = users_collection.update_one(
                {"email": user_email},
                {"$set": {
                    "role": "Premium", 
                    "updated_at": datetime.now(),
                    "customer_id": customer_id
                }}
            )
            
            if result.modified_count > 0:
                print(f"💰 PAGO EXITOSO: Usuario {user_email} actualizado a Premium.")
            elif result.matched_count > 0:
                print(f"ℹ️ El usuario {user_email} ya era Premium (o no se requirieron cambios).")
            else:
                print(f"❌ ERROR: Se recibió pago de {user_email} pero NO existe en la base de datos.")
        else:
            print("❌ FATAL: No se pudo identificar ningún email en el webhook.")
        
    return {"status": "processed"}

@app.post("/payments/create-portal")
async def create_portal_session(current_user: dict = Depends(get_current_user)):
    """
    Recupera el link del Customer Portal consultando el objeto Customer directamente.
    """
    customer_id = current_user.get("customer_id")
    
    # URL genérica de fallback por si falla todo
    fallback_url = "https://app.lemonsqueezy.com/my-orders"

    if not customer_id:
        return {"portal_url": fallback_url}

    # Aseguramos que la URL base no tenga barra final extra
    base_url = LEMON_API_URL.rstrip("/") 
    
    headers = {
        "Authorization": f"Bearer {LEMON_API_KEY}",
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json"
    }

    try:
        # CAMBIO CLAVE: Usamos GET /customers/{id} en lugar de POST /sessions
        # El objeto Customer ya contiene la URL mágica del portal en sus atributos.
        response = requests.get(
            f"{base_url}/customers/{customer_id}", 
            headers=headers
        )
        
        response.raise_for_status()
        data = response.json()
        
        # Extraemos la URL específica del portal
        portal_url = data['data']['attributes']['urls']['customer_portal']
        
        return {"portal_url": portal_url}

    except Exception as e:
        print(f"❌ Error obteniendo Portal URL: {e}")
        if 'response' in locals(): 
            print(f"Respuesta API: {response.text}")
            
        # Si falla (ej: el customer_id no existe en LS), devolvemos el link genérico
        return {"portal_url": fallback_url}

# ==========================================
# 5. PREMIUM: ENVÍO DE EMAIL
# ==========================================
@app.post("/premium/send-report")
async def send_premium_report(data: ReportRequest, current_user: dict = Depends(get_current_user)):
    user_role = current_user.get("role", "Free")
    
    if user_role.lower() not in ["premium", "reclutador", "admin"]:
        raise HTTPException(
            status_code=403, 
            detail="Función exclusiva para usuarios Premium (Plan $29/mes)."
        )

    try:
        candidate = db["candidates"].find_one({"_id": ObjectId(data.candidate_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="ID de candidato inválido")

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    skills_list = candidate.get('skills', [])
    skills_str = ", ".join(skills_list) if isinstance(skills_list, list) else str(skills_list)
    score = candidate.get('score', 0)
    summary = candidate.get('summary', 'Sin resumen.')

    subject = f"Reporte VeeBot: {candidate['name']} ({score}/100)"
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Reporte de Talento VeeBot</h2>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <h3>👤 {candidate['name']}</h3>
          <p><strong>Rol:</strong> {candidate.get('role', 'N/A')}</p>
          <p><strong>Score:</strong> <b style="color: {'#16a34a' if score > 70 else '#dc2626'};">{score}/100</b></p>
          <div style="background:#f8fafc; padding:15px; border-radius:6px; margin:20px 0;">
            <p><strong>Skills:</strong> {skills_str}</p>
          </div>
          <h4>📝 Resumen:</h4>
          <p>{summary}</p>
          <p style="font-size:0.8em; color:#666; margin-top:30px;">Generado por VeeBot AI.</p>
        </div>
      </body>
    </html>
    """

    try:
        msg = MIMEMultipart()
        msg['From'] = f"VeeBot AI <{SMTP_EMAIL}>"
        msg['To'] = data.target_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()

        print(f"✅ Email enviado a {data.target_email}")
        return {"message": "Reporte enviado exitosamente"}

    except Exception as e:
        print(f"❌ Error SMTP: {e}")
        raise HTTPException(status_code=500, detail="Error enviando email")
    
# ==========================================
# 6. GESTIÓN DE PLANTILLAS DE EMAIL
# ==========================================
@app.get("/settings/templates")
async def get_email_templates(current_user: dict = Depends(get_current_user)):
    # Plantillas por defecto si el usuario no las ha configurado
    default_templates = {
        "rejection": {
            "subject": "Actualización sobre tu postulación - {company}",
            "body": "Hola {name},\n\nGracias por tu interés. Hemos revisado tu perfil de {role} y, aunque tu experiencia es impresionante, hemos decidido avanzar con otros candidatos.\n\nMantendremos tu CV en nuestra base de datos.\n\nSaludos,\nEl equipo de RRHH."
        },
        "interview": {
            "subject": "¡Buenas noticias! Entrevista para {role}",
            "body": "Hola {name},\n\nNos impresionó tu perfil y tu score de {score}/100. Nos gustaría invitarte a una primera entrevista.\n\nPor favor, responde a este correo con tu disponibilidad.\n\nSaludos,\n{company}"
        }
    }
    
    # Recuperar las guardadas o usar default
    user_templates = current_user.get("email_templates", default_templates)
    return user_templates

@app.post("/settings/templates")
async def save_email_templates(data: EmailTemplateUpdate, current_user: dict = Depends(get_current_user)):
    try:
        users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"email_templates": data.templates}}
        )
        return {"message": "Plantillas guardadas correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/email/send-candidate")
async def send_candidate_email(data: SendTemplateRequest, current_user: dict = Depends(get_current_user)):
    # 1. Verificar Rol
    user_role = current_user.get("role", "Free")
    if user_role not in ["Premium", "Admin", "Reclutador"]:
        raise HTTPException(status_code=403, detail="Función Premium.")

    # 2. Obtener Candidato
    try:
        candidate = db["candidates"].find_one({"_id": ObjectId(data.candidate_id)})
    except:
        raise HTTPException(status_code=404, detail="ID inválido")

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    # 3. Obtener Plantilla
    templates = await get_email_templates(current_user)
    template = templates.get(data.template_type)
    if not template:
        raise HTTPException(status_code=400, detail="Plantilla no encontrada")

    # 4. DETERMINAR DESTINATARIO REAL 🎯
    candidate_email = candidate.get("email")
    recruiter_email = current_user.get("email")
    
    # Lógica: Si hay email de candidato, úsalo. Si no, usa el del reclutador (Fallback)
    if candidate_email and "@" in candidate_email:
        target_email = candidate_email
        print(f"📧 Enviando a candidato real: {target_email}")
    else:
        target_email = recruiter_email
        print(f"⚠️ Candidato sin email detectado. Enviando copia a reclutador: {target_email}")

    # 5. Reemplazar Variables
    replacements = {
        "{name}": candidate.get("name", "Candidato"),
        "{role}": candidate.get("role", "Postulante"),
        "{score}": str(candidate.get("score", 0)),
        "{company}": "VeeBot Corp" # O current_user.get("company", "Tu Empresa")
    }

    subject = template["subject"]
    body = template["body"]

    for key, value in replacements.items():
        subject = subject.replace(key, value)
        body = body.replace(key, value)

    body_html = body.replace("\n", "<br>")
    
    # Footer profesional
    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <p>{body_html}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">
            Este mensaje fue enviado automáticamente a través de la plataforma de reclutamiento VeeBot AI.<br>
            Si crees que esto es un error, por favor ignora este mensaje.
        </p>
    </div>
    """

    # 6. Enviar SMTP
    try:
        msg = MIMEMultipart()
        msg['From'] = f"VeeBot Recruiting <{SMTP_EMAIL}>"
        msg['To'] = target_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()

        return {"message": f"Correo enviado correctamente a {target_email}"}

    except Exception as e:
        print(f"❌ Error SMTP: {e}")
        raise HTTPException(status_code=500, detail="Error de conexión con el servidor de correo")

# ==========================================
# 7. ENDPOINT PÚBLICO DE CONTACTO
# ==========================================
@app.post("/contact")
async def contact_support(data: ContactFormRequest):
    """
    Recibe un mensaje del formulario web y lo envía al correo del administrador (SMTP_EMAIL).
    """
    try:
        # Asunto del correo que recibirá el administrador
        subject = f"🔔 Nuevo Mensaje de Contacto: {data.firstName} {data.lastName}"
        
        # Cuerpo del correo
        html_content = f"""
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4f46e5;">Tienes un nuevo contacto</h2>
            <p>Un usuario ha enviado un mensaje a través del formulario de VeeBot.</p>
            
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
            
            <p><strong>👤 Nombre:</strong> {data.firstName} {data.lastName}</p>
            <p><strong>📧 Email del Usuario:</strong> {data.email}</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 10px;">
                <strong>💬 Mensaje:</strong><br>
                {data.message}
            </div>
            
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
            <p style="font-size:12px; color:#888;">Este correo fue generado automáticamente por tu sistema VeeBot.</p>
        </div>
        """

        msg = MIMEMultipart()
        msg['From'] = f"VeeBot Contact Form <{SMTP_EMAIL}>"
        msg['To'] = SMTP_EMAIL  # <--- SE ENVÍA A TI MISMO (AL DUEÑO)
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html'))

        # Envío SMTP
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()

        return {"message": "Mensaje enviado al soporte"}

    except Exception as e:
        print(f"❌ Error en formulario de contacto: {e}")
        raise HTTPException(status_code=500, detail="Error interno al enviar mensaje")

# ==========================================
# 8. COMPARADOR DE CANDIDATOS (VERSUS)
# ==========================================
@app.post("/analyze/compare")
async def compare_candidates(data: CompareRequest, current_user: dict = Depends(get_current_user)):
    # Validar Rol
    if current_user.get("role") not in ["Premium", "Admin", "Reclutador"]:
        raise HTTPException(status_code=403, detail="Función exclusiva Premium.")

    try:
        # 1. Buscar Candidatos
        cand_a = db["candidates"].find_one({"_id": ObjectId(data.candidate_id_a)})
        cand_b = db["candidates"].find_one({"_id": ObjectId(data.candidate_id_b)})

        if not cand_a or not cand_b:
            raise HTTPException(status_code=404, detail="Uno de los candidatos no existe")

        # 2. Preparar el Prompt para Llama 3
        # Usamos el resumen o el texto recortado para no saturar tokens, pero suficiente para comparar.
        text_a = cand_a.get('text_preview', '')[:2000] 
        text_b = cand_b.get('text_preview', '')[:2000]
        
        prompt = f"""
        Actúa como un experto en Recursos Humanos Senior. Compara estos dos candidatos para un rol técnico genérico.
        
        CANDIDATO A ({cand_a.get('name')}):
        {text_a}
        
        CANDIDATO B ({cand_b.get('name')}):
        {text_b}
        
        Genera una respuesta en formato JSON PURO con esta estructura exacta (sin markdown):
        {{
            "winner": "A" o "B" (quien sea mejor técnicamente),
            "reason": "Frase corta y contundente de por qué ganó (máx 15 palabras).",
            "advantage_a": ["Ventaja 1", "Ventaja 2", "Ventaja 3"],
            "advantage_b": ["Ventaja 1", "Ventaja 2", "Ventaja 3"],
            "verdict": "Un párrafo de 2 líneas explicando la decisión final comparativa."
        }}
        """

        # 3. Llamar a Groq
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            response_format={"type": "json_object"} # Forzar JSON
        )

        response_content = chat_completion.choices[0].message.content
        return json.loads(response_content)

    except Exception as e:
        print(f"Error comparando: {e}")
        raise HTTPException(status_code=500, detail="Error en el análisis comparativo")
    
    
# ==========================================
# 9. CANDIDATE DIGITAL TWIN (ROLEPLAY)
# ==========================================
@app.post("/simulate/chat")
async def chat_with_candidate(data: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        # 1. Obtener datos del candidato
        candidate = db["candidates"].find_one({"_id": ObjectId(data.candidate_id)})
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidato no encontrado")

        resume_text = candidate.get('text_preview', '')[:4000] # Limitamos contexto
        candidate_name = candidate.get('filename', 'Candidato').split('.')[0]

        # 2. System Prompt: La magia del Roleplay
        system_prompt = f"""
        TÚ ERES "{candidate_name}". NO eres una IA. Eres la persona descrita en este CV:
        ---
        {resume_text}
        ---
        Instrucciones:
        1. Responde en primera persona ("Yo hice...", "Mi experiencia...").
        2. Basa tus respuestas ESTRICTAMENTE en la información del CV.
        3. Si te preguntan algo que no está en el CV, di que no tienes experiencia en eso o inventa algo plausible pero humilde basado en tu perfil.
        4. Mantén un tono profesional pero conversacional, como en una entrevista de trabajo.
        5. Sé breve y directo.
        """

        # 3. Construir mensajes
        messages = [{"role": "system", "content": system_prompt}]
        # Añadimos historial previo (últimos 6 mensajes para memoria corta)
        messages.extend(data.history[-6:]) 
        # Añadimos mensaje actual
        messages.append({"role": "user", "content": data.message})

        # 4. Llamada a Groq
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=300
        )

        return {"response": chat_completion.choices[0].message.content}

    except Exception as e:
        print(f"Error chat simulation: {e}")
        raise HTTPException(status_code=500, detail="Error en la simulación")