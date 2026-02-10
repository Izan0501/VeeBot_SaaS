import os
import re
import asyncio
import unicodedata
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from bson import ObjectId
from datetime import datetime

# Import Local Modules
from database import candidates_collection, insert_candidate, get_all_candidates_from_db, chats_collection
from security import get_current_user
from services import analyze_candidate_with_groq,  process_and_store_cv, chat_as_candidate, get_ai_score, index
from utils import robust_extract


router = APIRouter()

# --- FUNCIÓN AUXILIAR PARA PINECONE (ASCII FIX) ---
def sanitize_id(text: str) -> str:
    """Convierte texto con acentos a ASCII limpio (Ej: Sofía -> Sofia)"""
    nfkd_form = unicodedata.normalize('NFKD', text)
    ascii_text = nfkd_form.encode('ASCII', 'ignore').decode('utf-8')
    clean_text = re.sub(r'[^a-zA-Z0-9_-]', '', ascii_text.replace(' ', '_'))
    return clean_text

# Candidate Routes
@router.post("/upload")
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
    
    sem = asyncio.Semaphore(10) 

    async def process_single_file(file):
        async with sem:
            try:
                safe_filename = f"{user_id}_{file.filename}"
                file_location = f"uploads/{safe_filename}"
                
                content = await file.read()
                
                with open(file_location, "wb") as buffer:
                    buffer.write(content)
                
                # 1. Text Extraction
                text = await asyncio.to_thread(robust_extract, content)

                # 2. Email Extraction
                email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                found_emails = re.findall(email_pattern, text)
                extracted_email = found_emails[0] if found_emails else None
                
                # Preparamos nombres e IDs
                candidate_name = file.filename.replace(".pdf", "").replace("_", " ").title()
                vector_id = sanitize_id(candidate_name)

                print(f"🤖 Analizando: {candidate_name} (ID Vector: {vector_id})...")
                
                # 3. AI ANALYSIS
                ai_analysis = await asyncio.to_thread(get_ai_score, text, selected_model)
                
                score_val = ai_analysis.get("score", 0)
                status_final = "Bajo Potencial"
                if score_val >= threshold:
                    status_final = "Alto Potencial"
                elif score_val >= (threshold - 20):
                    status_final = "Medio Potencial"
                else:
                    status_final = "Rechazado Automático" if auto_reject else "Bajo Potencial"

                # 4. Save to MongoDB
                mongo_id = insert_candidate(
                    file.filename, 
                    candidate_name, 
                    text, 
                    {
                        **ai_analysis, 
                        "status": status_final,
                        "email": extracted_email,
                        "vector_id": vector_id # Guardamos referencia del ID usado en Pinecone
                    },
                    user_id
                ) 
                
                # 5. Pinecone Upsert
                # Se asume que esta función usa user_id como namespace
                process_and_store_cv(text, mongo_id, vector_id, user_id)

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
         raise HTTPException(status_code=500, detail=f"Falló el procesamiento. Errores: {results[0].get('msg')}")

    return {
        "status": "success", 
        "message": f"Procesados {success_count}/{len(files)} CVs.",
        "errors": errors
    }

@router.get("/candidates")
def get_candidates(current_user: dict = Depends(get_current_user)):
    try:
        return get_all_candidates_from_db(str(current_user["_id"]))
    except Exception as e:
        print(f"Error DB: {e}")
        raise HTTPException(status_code=500, detail="Error conectando a la base de datos")

@router.get("/chat/{candidate_id}")
def get_chat_history(candidate_id: str, current_user: dict = Depends(get_current_user)):
    """Recupera el historial de chat de un candidato específico."""
    user_id = str(current_user["_id"])
    
    # Buscamos mensajes ordenados por fecha
    cursor = chats_collection.find(
        {"user_id": user_id, "candidate_id": candidate_id}
    ).sort("timestamp", 1)
    
    messages = []
    for doc in cursor:
        messages.append({
            "role": doc["role"],
            "content": doc["content"],
            "timestamp": doc["timestamp"]
        })
    
    return messages

# --- MODIFICADO: CHAT CON LÍMITE GLOBAL Y PERSISTENCIA ---
@router.post("/chat/{candidate_id}")
async def digital_twin_chat(
    candidate_id: str,
    query: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = str(current_user["_id"])
        is_premium = current_user.get("is_premium") or current_user.get("isPremium") or False
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
        # Detección de Premium
        is_premium = current_user.get("is_premium") or current_user.get("isPremium") or False
        GLOBAL_LIMIT = 5 

        # 1. VERIFICACIÓN DE LÍMITE GLOBAL
        # Contamos mensajes totales (Tanto de Twins como del Dashboard)
        if not is_premium:
            total_msg_count = chats_collection.count_documents({
                "user_id": user_id, 
                "role": "user"
            })
            
            if total_msg_count >= GLOBAL_LIMIT:
                raise HTTPException(
                    status_code=403, 
                    detail=f"Límite Gratuito Alcanzado ({GLOBAL_LIMIT} consultas totales). Pásate a Premium."
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
    
    # Borramos solo los mensajes que coincidan con el usuario y el ID especial
    result = chats_collection.delete_many({
        "user_id": user_id,
        "candidate_id": SPECIAL_ID
    })
    
    print(f"🧹 Chat del Dashboard limpiado: {result.deleted_count} mensajes eliminados.")
    
    return {"status": "success", "message": "Historial del Dashboard eliminado"}

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