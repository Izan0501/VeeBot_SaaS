from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

# Import Local Modules
from database import users_collection, get_all_candidates_from_db, delete_full_user_data, tenants_collection
from bson import ObjectId
from security import get_password_hash, verify_password, create_access_token, get_current_user
from schemas import UserAuth, Token, UserProfileUpdate, PasswordChange, EmailRequest, DirectResetRequest, BrandingUpdate
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

    # Resolve the tenant subdomain so the frontend can redirect immediately
    # without a second round-trip to /auth/me (eliminates async waterfall).
    subdomain = None
    tenant_id = db_user.get("tenant_id")
    if tenant_id:
        tenant = tenants_collection.find_one(
            {"_id": ObjectId(tenant_id)},
            projection={"subdomain": 1}  # minimal projection — security best practice
        )
        if tenant:
            subdomain = tenant.get("subdomain")

    access_token = create_access_token(data={
        "sub": user.email,
        "tenant_id": tenant_id,
        "role": db_user.get("role", "Free")
    })
    return {"access_token": access_token, "token_type": "bearer", "subdomain": subdomain}


@router.get("/auth/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    settings = current_user.get("settings", {})
    tenant_id = current_user.get("tenant_id")
    tenant_config = None
    
    if tenant_id:
        tenant = tenants_collection.find_one({"_id": ObjectId(tenant_id)})
        if tenant:
            tenant_config = {
                "company_name": tenant.get("name"),
                "subdomain":    tenant.get("subdomain"),
                "branding":     tenant.get("branding"),
                "ai_niche":     tenant.get("ai_niche")
            }
    else:
        # Solo / Free user: branding is stored directly on the user document
        user_branding = current_user.get("branding")
        if user_branding:
            tenant_config = {"branding": user_branding}

    return {
        "email":       current_user.get("email"),
        "name":        current_user.get("name", "Usuario"),
        "role":        current_user.get("role", "Free"),
        "min_score":   settings.get("min_score", 70),
        "auto_reject": settings.get("auto_reject", False),
        "tenant_config": tenant_config
    }



@router.patch("/auth/branding", status_code=200)
def update_branding(
    data: BrandingUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Atomically update branding colours for the current user / tenant.

    Two execution paths:
    ① Tenant user (has tenant_id + role tenant_admin/Agency):
       → Writes to `tenants` collection using dot-notation $set so no other
         tenant fields (subscription, ai_niche, etc.) are touched.
    ② Solo / Free user (no tenant_id):
       → Writes to their own `users` document under `branding.*`
         so colours persist and are returned by GET /auth/me.
    """
    tenant_id = current_user.get("tenant_id")
    user_role  = current_user.get("role", "Free")

    # Build a sparse $set payload — only send fields the client explicitly provided
    set_payload: dict = {}
    for field, value in data.model_dump(exclude_none=True).items():
        set_payload[f"branding.{field}"] = value

    if not set_payload:
        raise HTTPException(status_code=422, detail="No se enviaron campos para actualizar.")

    # ── Path ①: Tenant user updating the shared tenant branding ─────────────
    if tenant_id:
        # Allowed if the role is any privileged label OR if this user is simply
        # the account that owns the tenant (tenant_id match is sufficient for admin).
        # This covers: tenant_admin, Agency, Agency Pro, Admin, Premium, Reclutador.
        TENANT_BRANDING_ROLES = {
            "tenant_admin", "Agency Pro", "Agency",
            "Admin", "admin", "Premium", "Reclutador",
        }
        is_elevated_role = user_role in TENANT_BRANDING_ROLES

        if not is_elevated_role:
            raise HTTPException(
                status_code=403,
                detail=(
                    f"El rol '{user_role}' no tiene permisos para modificar el branding del tenant. "
                    "Se requiere rol tenant_admin, Admin, Agency o superior."
                )
            )
        result = tenants_collection.update_one(
            {"_id": ObjectId(tenant_id)},
            {"$set": set_payload}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Tenant no encontrado.")
        return {"message": "Branding del tenant actualizado.", "updated_fields": list(set_payload.keys())}


    # ── Path ②: Solo / Free user — store branding on their own user doc ──────
    users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": set_payload}
    )
    return {"message": "Branding personal actualizado.", "updated_fields": list(set_payload.keys())}


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