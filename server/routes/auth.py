from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

# Import Local Modules
from database import users_collection, get_all_candidates_from_db, delete_full_user_data
from security import get_password_hash, verify_password, create_access_token, get_current_user
from schemas import UserAuth, Token, UserProfileUpdate, PasswordChange, EmailRequest, DirectResetRequest
from services import index  # Necesario para borrar vectores en Pinecone al eliminar cuenta

router = APIRouter()

# Auth Routes
@router.post("/auth/register", status_code=201)
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

@router.post("/auth/login", response_model=Token)
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

@router.get("/auth/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    settings = current_user.get("settings", {})
    return {
        "email": current_user.get("email"),
        "name": current_user.get("name", "Usuario"),
        "role": current_user.get("role", "Free"),
        "min_score": settings.get("min_score", 70),
        "auto_reject": settings.get("auto_reject", False)
    }

@router.put("/auth/me")
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

@router.put("/auth/change-password")
def change_password(data: PasswordChange, current_user: dict = Depends(get_current_user)):
    if not verify_password(data.current_password, current_user["password"]):
        raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
    
    new_hashed_pwd = get_password_hash(data.new_password)
    users_collection.update_one(
        {"email": current_user["email"]},
        {"$set": {"password": new_hashed_pwd}}
    )
    return {"message": "Contraseña actualizada exitosamente"}

@router.post("/auth/verify-email")
async def verify_email_exists(data: EmailRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="El correo no está registrado")
    return {"message": "Usuario encontrado", "exists": True}

@router.post("/auth/reset-password-direct")
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

@router.delete("/auth/me")
async def delete_account(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    role = current_user.get("role", "Free")

    if role in ["Premium", "Agency Pro", "Agency"]:
        raise HTTPException(status_code=403, detail="Cancela tu suscripción primero.")

    # 1. Get all candidate IDs for the user
    user_candidates = get_all_candidates_from_db(user_id)
    ids_to_delete = [c["id"] for c in user_candidates]

    # 2. Delete vectors from Pinecone
    if ids_to_delete:
        try:
            index.delete(ids=ids_to_delete)
            print(f"✅ Pinecone limpio para usuario {user_id}")
        except Exception as e:
            print(f"⚠️ Pinecone error: {e}")

    # 3. Delete user and all their data from MongoDB
    success = delete_full_user_data(user_id)

    if not success:
        raise HTTPException(status_code=500, detail="No se pudo borrar el usuario de la base de datos")

    return {"message": "Cuenta eliminada permanentemente."}