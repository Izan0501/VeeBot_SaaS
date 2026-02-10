from pydantic import BaseModel, EmailStr
from typing import List

# Auth and User Management Models

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

# Models for Candidate Management

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

# AI Interaction Models

class CompareRequest(BaseModel):
    candidate_id_a: str
    candidate_id_b: str

class ChatRequest(BaseModel):
    candidate_id: str
    message: str
    history: List[dict] = []