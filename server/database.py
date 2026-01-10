import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime
from bson import ObjectId 

# env load
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# connection
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)
db = client[os.getenv("DB_NAME", "recruit_db")]
candidates_collection = db["candidates"]

def insert_candidate(filename, name, text_preview, ai_data, user_id):
    """
    Guarda un candidato vinculándolo al ID del usuario que lo subió.
    """
    candidate_doc = {
        "user_id": user_id, 
        "filename": filename,
        "name": name,
        "role": ai_data.get("role", "Desconocido"),
        "score": ai_data.get("score", 0),
        "status": ai_data.get("status", "Pendiente"),
        "summary": ai_data.get("summary", "Sin resumen generado."), 
        "skills": ai_data.get("skills", []), 
        "text_preview": text_preview[:200], 
        "upload_date": datetime.now(),
        "ai_analysis_raw": ai_data 
    }
    
    result = candidates_collection.insert_one(candidate_doc)
    return str(result.inserted_id)

def get_all_candidates_from_db(user_id):
    """
    Recupera SOLO los candidatos que pertenecen al usuario actual.
    """
    candidates = []
    # FILTRO: Solo documentos donde user_id coincida
    cursor = candidates_collection.find({"user_id": user_id}).sort("upload_date", -1)
    
    for doc in cursor:
        skills = doc.get("skills", [])
        if not skills and "ai_analysis" in doc:
             skills = doc["ai_analysis"].get("skills", [])

        candidates.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", "Desconocido"),
            "role": doc.get("role", "Sin rol"),
            "score": doc.get("score", 0),
            "status": doc.get("status", "Pendiente"),
            "date": doc.get("upload_date", datetime.now()).strftime("%d/%m %H:%M"),
            "summary": doc.get("summary", "Sin información disponible"),
            "skills": skills
        })
    
    return candidates

def delete_candidate_by_id(candidate_id, user_id):
    """
    Borra un candidato, pero verifica que pertenezca al usuario (seguridad).
    """
    try:
        result = candidates_collection.delete_one({
            "_id": ObjectId(candidate_id),
            "user_id": user_id # <--- Seguridad extra: solo borra si es tuyo
        })
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error borrando: {e}")
        return False
    
def delete_full_user_data(user_id, users_col, candidates_col):
    """
    Borra el usuario y todos sus candidatos asociados.
    """
    try:
        # 1. Borrar Candidatos
        candidates_col.delete_many({"user_id": user_id})
        
        # 2. Borrar Usuario
        result = users_col.delete_one({"_id": ObjectId(user_id)})
        
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error borrando datos Mongo: {e}")
        return False