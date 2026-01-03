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

def insert_candidate(filename, name, text_preview, ai_data):
    # Save metadata of a candidate into the database.
    candidate_doc = {
        "filename": filename,
        "name": name,
        # --- AQUÍ ESTABAN FALTANDO CAMPOS ---
        "role": ai_data.get("role", "Desconocido"),
        "score": ai_data.get("score", 0),
        "status": ai_data.get("status", "Pendiente"),
        # Guardamos explícitamente summary y skills
        "summary": ai_data.get("summary", "Sin resumen generado."), 
        "skills": ai_data.get("skills", []), 
        # ------------------------------------
        "text_preview": text_preview[:200], 
        "upload_date": datetime.now(),
        # Opcional: Guardamos el objeto crudo completo por si acaso
        "ai_analysis_raw": ai_data 
    }
    
    # Insert and return the inserted ID as string
    result = candidates_collection.insert_one(candidate_doc)
    return str(result.inserted_id)

# get all candidates from db
def get_all_candidates_from_db():
    candidates = []
    cursor = candidates_collection.find().sort("upload_date", -1)
    
    for doc in cursor:
        # Recuperación robusta de skills
        skills = doc.get("skills", [])
        
        # Fallback para datos antiguos que quizás tenían estructura anidada
        if not skills and "ai_analysis" in doc:
             skills = doc["ai_analysis"].get("skills", [])

        candidates.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", "Desconocido"),
            "role": doc.get("role", "Sin rol"),
            "score": doc.get("score", 0),
            "status": doc.get("status", "Pendiente"),
            "date": doc.get("upload_date", datetime.now()).strftime("%d/%m %H:%M"),
            "summary": doc.get("summary", "Sin información disponible"), # Ahora sí lo encontrará
            "skills": skills # Ahora sí lo encontrará
        })
    
    return candidates

# delete candidate by id
def delete_candidate_by_id(candidate_id):
    """
    Borra un candidato de la base de datos usando su ID único.
    """
    try:
        # Convertimos el string a ObjectId de Mongo
        result = candidates_collection.delete_one({"_id": ObjectId(candidate_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error borrando: {e}")
        return False