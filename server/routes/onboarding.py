from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from database import tenants_collection, users_collection
from schemas import TenantOnboardingRequest, TenantResponse
from security import get_password_hash, create_access_token

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

# ── Public Branding Schema (safe — no sensitive fields) ───────────────────────
class PublicBrandingResponse(BaseModel):
    company_name: str
    primary_color: str
    secondary_color: str
    logo_url: Optional[str] = None

@router.post("", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
async def create_tenant(request: TenantOnboardingRequest):
    # 1. Verificar si el subdominio ya existe
    existing_tenant = tenants_collection.find_one({"subdomain": request.subdomain})
    if existing_tenant:
        raise HTTPException(status_code=400, detail="El subdominio ya está en uso.")
    
    # 2. Verificar si el email ya existe en algún tenant
    existing_user = users_collection.find_one({"email": request.admin_email})
    if existing_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado.")
    
    # 3. Crear el Tenant
    tenant_doc = {
        "name": request.company_name,
        "subdomain": request.subdomain,
        "branding": request.branding.model_dump(),
        "ai_niche": request.ai_niche,
        "subscription": {
            "plan": "demo",  # Inicialmente demo, pueden pagar luego con LemonSqueezy
            "active": True
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    tenant_insert_result = tenants_collection.insert_one(tenant_doc)
    tenant_id = str(tenant_insert_result.inserted_id)
    
    # 4. Crear el Usuario Administrador del Tenant
    user_doc = {
        "tenant_id": tenant_id,
        "email": request.admin_email,
        "password": get_password_hash(request.admin_password),
        "name": request.admin_name,
        "role": "tenant_admin",
        "settings": {
            "min_score": 50,
            "auto_reject": False,
            "model": "llama-3.3-70b-versatile"
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    users_collection.insert_one(user_doc)
    
    # 5. Generar Token JWT
    access_token = create_access_token(
        data={"sub": request.admin_email, "tenant_id": tenant_id, "role": "tenant_admin"}
    )
    
    return {
        "tenant_id": tenant_id,
        "company_name": request.company_name,
        "subdomain": request.subdomain,
        "message": "Tenant y administrador creados exitosamente.",
        "access_token": access_token
    }

@router.get("/branding/{subdomain}", response_model=PublicBrandingResponse)
async def get_tenant_branding(subdomain: str):
    """
    Public endpoint — returns ONLY safe visual branding data.
    Never exposes ai_niche, subscription, or internal config.
    Called by TenantProvider before authentication.
    """
    tenant = tenants_collection.find_one(
        {"subdomain": subdomain.lower().strip()},
        # Projection: only fetch the fields we need (security + performance)
        {"name": 1, "branding": 1, "_id": 0}
    )
    if not tenant:
        raise HTTPException(
            status_code=404,
            detail=f"Tenant '{subdomain}' not found."
        )

    branding = tenant.get("branding", {})
    return PublicBrandingResponse(
        company_name=tenant.get("name", ""),
        primary_color=branding.get("primary_color", "#0F172A"),
        secondary_color=branding.get("secondary_color", "#3B82F6"),
        logo_url=branding.get("logo_url"),
    )
