import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pathlib import Path
from dotenv import load_dotenv

# Import collections and DB functions
from database import users_collection

# Load .env file
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey") # Valor por defecto por si falta en .env
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# PASSLIB CONFIG
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAUTH2 CONFIG
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Functions for Authentication and Token Management  
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    
    # Check if the user belongs to a tenant (superadmins might not, but let's be flexible)
    # The user dict will now naturally contain 'tenant_id' if they are bound to a tenant.
    return user

# Dependency to ensure the current action is executed within a valid Tenant context
async def get_current_tenant(current_user: dict = Depends(get_current_user)):
    tenant_id = current_user.get("tenant_id")
    if not tenant_id:
        # Si el usuario no tiene tenant asignado, no puede operar en endpoints B2B
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El usuario no pertenece a ningún Tenant (Agencia)."
        )
    return str(tenant_id)