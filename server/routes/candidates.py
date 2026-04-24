import os
import re
import asyncio
import unicodedata
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

# Import Local Modules
from database import candidates_collection, usage_collection, insert_candidate, get_all_candidates_from_db, chats_collection
from security import get_current_user
from services import analyze_candidate_with_groq, process_and_store_cv, chat_as_candidate, index
from utils import robust_extract


router = APIRouter()

# ── Pydantic schema para el resultado de análisis IA del frontend ───────────────
class AnalysisResult(BaseModel):
    role: str
    score: int
    skills: List[str]
    summary: str

# --- FUNCIÓN AUXILIAR PARA PINECONE (ASCII FIX) ---
def sanitize_id(text: str) -> str:
    """Convierte texto con acentos a ASCII limpio (Ej: Sofía -> Sofia)"""
    nfkd_form = unicodedata.normalize('NFKD', text)
    ascii_text = nfkd_form.encode('ASCII', 'ignore').decode('utf-8')
    clean_text = re.sub(r'[^a-zA-Z0-9_-]', '', ascii_text.replace(' ', '_'))
    return clean_text

@router.post("/upload")
async def upload_cvs(
    files: List[UploadFile] = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Extrae texto de PDFs y los guarda en MongoDB con status 'pending_analysis'.
    El análisis IA (Groq) lo realiza el FRONTEND para evitar bloqueos de red.
    Retorna la lista de candidatos creados con {id, name, text} para que el
    frontend llame a PATCH /candidates/{id}/analysis con el resultado.
    """
    user_id = str(current_user["_id"])

    if not files:
        raise HTTPException(status_code=400, detail="No se enviaron archivos.")

    os.makedirs("uploads", exist_ok=True)

    # Semaphore: 20 concurrent porque es solo I/O + CPU (sin red)
    sem = asyncio.Semaphore(20)

    async def process_single_file(file: UploadFile):
        async with sem:
            try:
                content = await file.read()

                # Guardar archivo en disco (referencia)
                safe_filename = f"{user_id}_{file.filename}"
                file_location = f"uploads/{safe_filename}"
                with open(file_location, "wb") as buf:
                    buf.write(content)

                # 1. Extraer texto del PDF
                text = await asyncio.to_thread(robust_extract, content)

                # Si el PDF no tiene texto extraible (escaneado/imagen) aún guardamos
                # el candidato para que el frontend pueda intentar el análisis
                # con el nombre del archivo como contexto mínimo.
                effective_text = text.strip() if text else ""

                # 2. Extraer email si existe en el texto
                found_emails = re.findall(
                    r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
                    effective_text
                )
                extracted_email = found_emails[0] if found_emails else None

                # 3. Nombre e ID de vector
                candidate_name = (
                    file.filename
                    .replace(".pdf", "")
                    .replace(".PDF", "")
                    .replace("_", " ")
                    .strip()
                    .title()
                )
                vector_id = sanitize_id(candidate_name)

                # 4. Guardar en MongoDB con status pending (sin IA aún)
                mongo_id = insert_candidate(
                    file.filename,
                    candidate_name,
                    effective_text,
                    {
                        "role": "Pendiente de análisis",
                        "score": 0,
                        "skills": [],
                        "summary": "",
                        "status": "pending_analysis",
                        "email": extracted_email,
                        "vector_id": vector_id,
                    },
                    user_id
                )

                # 5. Pinecone (solo si hay texto útil)
                if effective_text:
                    process_and_store_cv(effective_text, mongo_id, vector_id, user_id)

                print(f"✅ Guardado (pendiente): {candidate_name} [{mongo_id}]")

                return {
                    "id": str(mongo_id),
                    "name": candidate_name,
                    "text": effective_text,   # Frontend necesita el texto para Groq
                    "status": "pending_analysis",
                }

            except Exception as e:
                print(f"❌ Error en {file.filename}: {e}")
                return {"file": file.filename, "status": "error", "msg": str(e)}

    print(f"🚀 Procesando {len(files)} archivos (extracción solo)...")
    tasks = [process_single_file(f) for f in files]
    results = await asyncio.gather(*tasks)

    ok = [r for r in results if r.get("status") != "error"]
    errors = [r for r in results if r.get("status") == "error"]

    if not ok and errors:
        raise HTTPException(
            status_code=500,
            detail=f"Todos los archivos fallaron. Primer error: {errors[0].get('msg')}"
        )

    return {
        "status": "success",
        "message": f"Texto extraído de {len(ok)}/{len(files)} CVs. Listo para análisis IA.",
        "candidates": ok,    # [{id, name, text, status}, ...]
        "errors": errors,
    }

@router.get("/candidates")
def get_candidates(current_user: dict = Depends(get_current_user)):
    try:
        return get_all_candidates_from_db(str(current_user["_id"]))
    except Exception as e:
        print(f"Error DB: {e}")
        raise HTTPException(status_code=500, detail="Error conectando a la base de datos")

@router.get("/candidates/{candidate_id}")
def get_candidate_detail(candidate_id: str, current_user: dict = Depends(get_current_user)):
    """
    Retorna un candidato individual con su texto completo de CV.
    Necesario para el Digital Twin en el frontend.
    """
    user_id = str(current_user["_id"])
    candidate = candidates_collection.find_one({
        "_id": ObjectId(candidate_id),
        "user_id": user_id
    })
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    return {
        "id": str(candidate["_id"]),
        "name": candidate.get("name", "Candidato"),
        "role": candidate.get("role", ""),
        "score": candidate.get("score", 0),
        "summary": candidate.get("summary", ""),
        "skills": candidate.get("skills", []),
        # text completo del CV — usado por Digital Twin en el frontend
        "text": candidate.get("text") or candidate.get("summary", "Sin información del CV."),
    }


@router.patch("/candidates/{candidate_id}/analysis")
def save_candidate_analysis(
    candidate_id: str,
    result: AnalysisResult,
    current_user: dict = Depends(get_current_user)
):
    """
    El frontend llama este endpoint después de analizar el CV con Groq.
    Persiste role, score, skills y summary en MongoDB y calcula el status
    final basándose en el threshold configurado por el usuario.
    """
    user_id = str(current_user["_id"])

    # Validar propiedad del candidato
    try:
        candidate = candidates_collection.find_one({
            "_id": ObjectId(candidate_id),
            "user_id": user_id,
        })
    except Exception:
        raise HTTPException(status_code=400, detail="ID de candidato inválido")

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    # Calcular status según threshold del usuario
    user_settings = current_user.get("settings", {"min_score": 70, "auto_reject": False})
    threshold = user_settings.get("min_score", 70)
    auto_reject = user_settings.get("auto_reject", False)

    score = result.score
    if score >= threshold:
        status_final = "Alto Potencial"
    elif score >= (threshold - 20):
        status_final = "Medio Potencial"
    else:
        status_final = "Rechazado Automático" if auto_reject else "Bajo Potencial"

    candidates_collection.update_one(
        {"_id": ObjectId(candidate_id)},
        {"$set": {
            "role":    result.role,
            "score":   score,
            "skills":  result.skills,
            "summary": result.summary,
            "status":  status_final,
            "analysis_date": datetime.utcnow(),
        }}
    )

    print(f"✅ Análisis guardado: {candidate.get('name')} — score {score} → {status_final}")

    return {
        "id": candidate_id,
        "status": status_final,
        "score": score,
    }


@router.get("/chat/{candidate_id}")
def get_chat_history(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    SPECIAL_ID = "DASHBOARD_ASSISTANT"
    
    # 1. Obtener historial visible (Chats guardados)
    cursor = chats_collection.find(
        {"user_id": user_id, "candidate_id": SPECIAL_ID}
    ).sort("timestamp", 1)
    
    messages = []
    for doc in cursor:
        messages.append({
            "id": str(doc["_id"]), 
            "role": "ai" if doc["role"] == "assistant" else "user", 
            "text": doc["content"]
        })

    # --- CORRECCIÓN AQUÍ ---
    # ANTES (Incorrecto para Hard Delete): Contaba mensajes existentes
    # usage_count = chats_collection.count_documents({"user_id": user_id, "role": "user"})

    # AHORA (Correcto): Leemos el contador persistente de la colección de uso
    usage_doc = usage_collection.find_one({"user_id": user_id})
    usage_count = usage_doc.get("ai_queries_count", 0) if usage_doc else 0
    # -----------------------
    
    return {
        "history": messages,
        "usage_count": usage_count
    }

# --- MODIFICADO: CHAT CON LÍMITE GLOBAL Y PERSISTENCIA ---
@router.post("/chat/{candidate_id}")
async def digital_twin_chat(
    candidate_id: str,
    query: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = str(current_user["_id"])
        # Verificación correcta: usa el campo 'role' igual que el resto del sistema
        PREMIUM_ROLES = {"Premium", "Admin", "Reclutador", "Agency", "Agency Pro"}
        is_premium = current_user.get("role") in PREMIUM_ROLES
        GLOBAL_LIMIT = 2

        # 1. VERIFICACIÓN DE LÍMITE GLOBAL (Solo para NO Premium)
        if not is_premium:
            # Contamos SOLO los mensajes enviados por el usuario ('role': 'user')
            # Esto cuenta TODAS las preguntas hechas a CUALQUIER candidato
            current_count = chats_collection.count_documents({
                "user_id": user_id, 
                "role": "user"
            })
            
            # --- DEBUG LOGS (MIRA ESTO EN TU CONSOLA) ---
            print(f"🕵️‍♂️ DEBUG LÍMITE: Usuario Premium? {is_premium}")
            print(f"🔢 DEBUG LÍMITE: Consultas realizadas: {current_count} / {GLOBAL_LIMIT}")
            # ---------------------------------------------

            if current_count >= GLOBAL_LIMIT:
                print("⛔ BLOQUEO: Límite excedido.")
                # Lanzamos 403 Forbidden
                raise HTTPException(
                    status_code=403, 
                    detail=f"Límite Gratuito Alcanzado ({GLOBAL_LIMIT} consultas). Actualiza a Premium."
                )

        # 2. Buscar al candidato y validar texto
        candidate = candidates_collection.find_one({
            "_id": ObjectId(candidate_id), 
            "user_id": user_id
        })
        
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidato no encontrado")

        candidate_name = candidate.get("name", "Candidato")
        full_text = candidate.get("text") or candidate.get("summary", "Sin información.")

        print(f"💬 Chat con {candidate_name}: {query}")

        # 3. Guardar mensaje del USUARIO en DB
        chats_collection.insert_one({
            "user_id": user_id,
            "candidate_id": candidate_id,
            "role": "user",
            "content": query,
            "timestamp": datetime.utcnow()
        })

        # 4. Llamar a la IA
        response_text = await asyncio.to_thread(
            chat_as_candidate, 
            candidate_name, 
            full_text, 
            query
        )
        
        # 5. Guardar respuesta de la IA en DB
        chats_collection.insert_one({
            "user_id": user_id,
            "candidate_id": candidate_id,
            "role": "assistant",
            "content": response_text,
            "timestamp": datetime.utcnow()
        })
        
        return {"response": response_text, "candidate": candidate_name}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Error en Digital Twin: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- AGREGAR AL FINAL DE server/routes/candidates.py ---
@router.post("/analyze")
async def chat_with_recruiter(
    query: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = str(current_user["_id"])
        # Verificación correcta: usa el campo 'role' igual que el resto del sistema
        PREMIUM_ROLES = {"Premium", "Admin", "Reclutador", "Agency", "Agency Pro"}
        is_premium = current_user.get("role") in PREMIUM_ROLES
        GLOBAL_LIMIT = 5 

        # --- 1. LÓGICA DE LÍMITE PROFESIONAL ---
        if not is_premium:
            # Buscamos el registro de uso de este usuario
            usage_doc = usage_collection.find_one({"user_id": user_id})
            
            # Si no existe, asumimos que lleva 0
            current_count = usage_doc.get("ai_queries_count", 0) if usage_doc else 0
            
            if current_count >= GLOBAL_LIMIT:
                 raise HTTPException(
                    status_code=403, 
                    detail=f"Límite Gratuito Alcanzado ({GLOBAL_LIMIT} consultas). Pásate a Premium."
                )

            # INCREMENTAMOS EL CONTADOR (Atomic Update)
            # upsert=True crea el documento si no existe.
            usage_collection.update_one(
                {"user_id": user_id},
                {"$inc": {"ai_queries_count": 1}},
                upsert=True
            )

        # 2. Construir Contexto Global (Resumen de TODOS los candidatos)
        # Esto es lo que diferencia a este chat: sabe un poco de todos.
        candidates_list = get_all_candidates_from_db(user_id)
        
        if not candidates_list:
            context_text = "El usuario no tiene candidatos cargados aún. Ayúdalo con dudas generales de RRHH."
        else:
            context_text = "Tengo acceso a los siguientes candidatos en mi base de datos:\n"
            for c in candidates_list:
                # Resumimos para no saturar al modelo
                skills = c.get("skills", [])
                skills_str = ", ".join(skills[:5]) if isinstance(skills, list) else str(skills)
                context_text += f"- {c.get('name')} ({c.get('role')}): Score {c.get('score')}. Skills: {skills_str}.\n"

        print(f"🧠 Dashboard AI Query: {query}")

        # 3. GUARDAR MENSAJE USUARIO
        # Usamos un ID especial para identificar que esto es del Dashboard
        SPECIAL_ID = "DASHBOARD_ASSISTANT"

        chats_collection.insert_one({
            "user_id": user_id,
            "candidate_id": SPECIAL_ID, 
            "role": "user",
            "content": query,
            "timestamp": datetime.utcnow()
        })

        # 4. Llamar a la IA (Usamos una función que acepte contexto general)
        # Nota: Usamos analyze_candidate_with_groq reusando la lógica, o crea una nueva si prefieres prompt distinto
        response_text = await asyncio.to_thread(analyze_candidate_with_groq, query, context_text)
        
        # 5. GUARDAR RESPUESTA IA
        chats_collection.insert_one({
            "user_id": user_id,
            "candidate_id": SPECIAL_ID,
            "role": "assistant",
            "content": response_text,
            "timestamp": datetime.utcnow()
        })

        return {"response": response_text}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Error en Dashboard Chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/chat/dashboard")
def clear_dashboard_chat(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    SPECIAL_ID = "DASHBOARD_ASSISTANT"
    
    # Esto limpia la base de datos pero NO afecta el límite del usuario
    result = chats_collection.delete_many({
        "user_id": user_id,
        "candidate_id": SPECIAL_ID
    })
    
    print(f"🧹 Chat Dashboard eliminado: {result.deleted_count} mensajes.")
    return {"status": "success", "message": "Historial eliminado"}

# --- MODIFICADO: DELETE CANDIDATE (Limpia historial) ---
@router.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])

    # A. Verificar propiedad
    candidate = candidates_collection.find_one({"_id": ObjectId(candidate_id), "user_id": user_id})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    # B. Borrar de Pinecone (Tu lógica actual)
    try:
        target_vector_id = candidate.get("vector_id") or sanitize_id(candidate.get("name", ""))
        if target_vector_id:
            index.delete(ids=[target_vector_id], namespace=user_id)
    except Exception as e:
        print(f"⚠️ Error Pinecone: {e}")

    # C. Borrar de MongoDB (Candidato)
    candidates_collection.delete_one({"_id": ObjectId(candidate_id)})

    # D. --- NUEVO: BORRAR HISTORIAL DE CHAT DE ESTE CANDIDATO ---
    delete_result = chats_collection.delete_many({
        "user_id": user_id, 
        "candidate_id": candidate_id
    })
    print(f"🧹 Historial de chat eliminado: {delete_result.deleted_count} mensajes.")

    return {"status": "success", "message": "Candidato y su historial eliminados"}

@router.delete("/candidates")
def delete_all_user_candidates(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # 1. Delete ALL from Pinecone for this user
    try:
        index.delete(delete_all=True, namespace=user_id)
        print(f"🗑️ Namespace {user_id} vaciado en Pinecone.")
    except Exception as e:
        error_msg = str(e)
        if "Namespace not found" in error_msg or "404" in error_msg:
            print(f"ℹ️ El namespace {user_id} no existía en Pinecone (ya estaba limpio).")
        else:
            print(f"⚠️ Error Pinecone Bulk Delete: {e}")

    # 2. Delete from MongoDB (Candidatos)
    candidates_result = candidates_collection.delete_many({"user_id": user_id})

    # 3. Delete from MongoDB (Historial de Chats) --- ¡NUEVO! ---
    chats_result = chats_collection.delete_many({"user_id": user_id})
    
    return {
        "status": "success", 
        "message": f"Se eliminaron {candidates_result.deleted_count} candidatos y {chats_result.deleted_count} mensajes de historial."
    }