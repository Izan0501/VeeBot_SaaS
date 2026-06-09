from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from config import MONGO_URI, DB_NAME

#DB connection
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]

# Collections
tenants_collection = db["tenants"]
candidates_collection = db["candidates"]
users_collection = db["users"]
chats_collection = db["chats"]
twins_chat_collection = db["twins_chat"]
usage_collection = db["user_usage"]


# DB Functions for Candidates
def insert_candidate(filename, name, text_preview, ai_data, user_id):
    """
    Save candidate data to MongoDB, including AI analysis results and user association.
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
        "email": ai_data.get("email"),
        "text_preview": text_preview[:200], 
        "upload_date": datetime.now(),
        "ai_analysis_raw": ai_data 
    }
    
    result = candidates_collection.insert_one(candidate_doc)
    return str(result.inserted_id)

def get_all_candidates_from_db(user_id):
    """
    Get only the candidates that belong to the user (security) and return a simplified list for the frontend.
    """
    candidates = []
    # FILTER: Only candidates where "user_id" matches the provided user_id, sorted by upload_date descending
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
            "skills": skills,
            "email": doc.get("email")
        })
    
    return candidates

def delete_candidate_by_id(candidate_id, user_id):
    """
    Delete a candidate by its ID, but only if it belongs to the user (security).
    """
    try:
        result = candidates_collection.delete_one({
            "_id": ObjectId(candidate_id),
            "user_id": user_id
        })
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error borrando: {e}")
        return False
    
def delete_full_user_data(user_id):
    """
    Delete user and all their candidates from MongoDB
    """
    try:
        # 1. Delete Candidates
        candidates_result = candidates_collection.delete_many({"user_id": user_id})
        print(f"Eliminados {candidates_result.deleted_count} candidatos de Mongo.")
        
        # 2. Delete User
        users_result = users_collection.delete_one({"_id": ObjectId(user_id)})
        
        # True if user was deleted, False if not found or error
        return users_result.deleted_count > 0
    except Exception as e:
        print(f"Error borrando datos Mongo: {e}")
        return False