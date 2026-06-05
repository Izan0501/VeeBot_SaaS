from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator
from typing import List, Optional
import re

# ----------------------------------------------------
# Multi-Tenant & Onboarding Models
# ----------------------------------------------------

class BrandingConfig(BaseModel):
    logo_url: Optional[HttpUrl] = Field(None, description="URL del logo corporativo")
    primary_color: str = Field(default="#0F172A", pattern=r"^#(?:[0-9a-fA-F]{3}){1,2}$")
    secondary_color: str = Field(default="#3B82F6", pattern=r"^#(?:[0-9a-fA-F]{3}){1,2}$")

class TenantOnboardingRequest(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=100)
    subdomain: str = Field(..., min_length=3, max_length=63)
    ai_niche: str = Field(..., description="Nicho principal para calibrar la IA")
    branding: BrandingConfig
    admin_email: EmailStr
    admin_password: str = Field(..., min_length=8)
    admin_name: str = Field(..., min_length=2)

    @field_validator('subdomain')
    @classmethod
    def validate_subdomain(cls, v: str) -> str:
        v = v.lower().strip()
        if not re.match(r"^[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?$", v):
            raise ValueError('Subdominio inválido. Use solo letras minúsculas, números y guiones.')
        forbidden = {"www", "api", "admin", "app", "veebot", "mail", "soporte"}
        if v in forbidden:
            raise ValueError('Este subdominio está reservado.')
        return v

class TenantResponse(BaseModel):
    tenant_id: str
    company_name: str
    subdomain: str
    message: str = "Tenant creado exitosamente."
    access_token: str

# Auth and User Management Models

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    subdomain: Optional[str] = None  # tenant subdomain, used for cross-origin redirect post-login

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

# Models for Candidate Management

class ReportRequest(BaseModel):
    candidate_id: str
    target_email: EmailStr

class EmailTemplateUpdate(BaseModel):
    templates: dict 

class SendTemplateRequest(BaseModel):
    candidate_id: str
    template_type: str
    email: Optional[str] = None
    status: Optional[str] = None

class ContactFormRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    message: str

# AI Interaction Models

class CompareRequest(BaseModel):
    candidate_id_a: str
    candidate_id_b: str

class ChatRequest(BaseModel):
    candidate_id: str
    message: str
    history: List[dict] = []