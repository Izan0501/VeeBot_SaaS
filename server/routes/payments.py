import hmac
import hashlib
import requests
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Header, Request

# Local Imports
from config import (
    LEMON_API_KEY, 
    LEMON_STORE_ID, 
    LEMON_VARIANT_ID, 
    LEMON_WEBHOOK_SECRET, 
    LEMON_API_URL
)
from database import users_collection
from security import get_current_user

router = APIRouter()

# Payment Routes
@router.post("/payments/create-checkout")
async def create_checkout_session(current_user: dict = Depends(get_current_user)):
    if not LEMON_API_KEY or not LEMON_VARIANT_ID:
        raise HTTPException(status_code=500, detail="Configuración de pagos incompleta")

    headers = {
        "Authorization": f"Bearer {LEMON_API_KEY}",
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json"
    }

    # Sending custom data to track user
    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "checkout_data": {
                    "custom": {
                        "user_email": current_user["email"],
                        "user_id": str(current_user["_id"]) 
                    }
                }
            },
            "relationships": {
                "store": {
                    "data": {"type": "stores", "id": LEMON_STORE_ID}
                },
                "variant": {
                    "data": {"type": "variants", "id": LEMON_VARIANT_ID}
                }
            }
        }
    }

    try:
        response = requests.post(f"{LEMON_API_URL}/checkouts", json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return {"checkout_url": data['data']['attributes']['url']}
    except Exception as e:
        print(f"Error Checkout: {e}")
        if 'response' in locals(): print(response.text)
        raise HTTPException(status_code=500, detail="Error al conectar con la pasarela de pago")

@router.post("/payments/webhook")
async def lemon_webhook(request: Request, x_signature: str = Header(None)):
    """
    Webhook managed to handle Lemon Squeezy events.
    """
    if not x_signature:
        raise HTTPException(status_code=401, detail="Firma no proporcionada")

    # 1. Validate Signature
    raw_body = await request.body()
    if not LEMON_WEBHOOK_SECRET:
        print("❌ ERROR: LEMON_WEBHOOK_SECRET no configurado")
        raise HTTPException(status_code=500, detail="Error servidor")

    digest = hmac.new(LEMON_WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(digest, x_signature):
        print("❌ Firma inválida")
        raise HTTPException(status_code=401, detail="Firma inválida")

    # 2. Parsing
    data = await request.json()
    
    # Get event details
    meta = data.get('meta', {})
    event_name = meta.get('event_name')
    attributes = data.get('data', {}).get('attributes', {})
    
    print(f"🔔 Webhook recibido: {event_name}")

    if event_name in ["order_created", "subscription_created", "subscription_payment_success", "subscription_updated"]:
        
        custom_data = None

        # Deep Search for Custom Data
        
        # 1. Root META Search
        if 'custom_data' in meta:
            custom_data = meta.get('custom_data')
            print("✅ Custom Data encontrado en 'meta' (Root)")

        # 2. Attributes Search
        if not custom_data and 'custom_data' in attributes:
            custom_data = attributes.get('custom_data')
            print("✅ Custom Data encontrado en 'attributes'")

        # 3. CHECKOUT_DATA Search
        if not custom_data:
             checkout_data = attributes.get('checkout_data')
             if checkout_data and 'custom' in checkout_data:
                 custom_data = checkout_data.get('custom')
                 print("✅ Custom Data encontrado en 'checkout_data'")

        print(f"📦 Datos extraídos: {custom_data}")
        
        # User Processing
        user_email = None
        customer_id = attributes.get('customer_id')
        
        # User email registration priority:
        if custom_data and isinstance(custom_data, dict):
            user_email = custom_data.get('user_email')
        
        # Fallback (user mail from billing info)
        if not user_email:
            user_email = attributes.get('user_email')
            print(f"⚠️ Alerta: Usando email de facturación ({user_email}). Puede no coincidir con el usuario registrado.")

        if user_email:
            # Update user role to Premium
            result = users_collection.update_one(
                {"email": user_email},
                {"$set": {
                    "role": "Premium", 
                    "updated_at": datetime.now(),
                    "customer_id": customer_id
                }}
            )
            
            if result.modified_count > 0:
                print(f"💰 PAGO EXITOSO: Usuario {user_email} actualizado a Premium.")
            elif result.matched_count > 0:
                print(f"ℹ️ El usuario {user_email} ya era Premium (o no se requirieron cambios).")
            else:
                print(f"❌ ERROR: Se recibió pago de {user_email} pero NO existe en la base de datos.")
        else:
            print("❌ FATAL: No se pudo identificar ningún email en el webhook.")
        
    return {"status": "processed"}

@router.post("/payments/create-portal")
async def create_portal_session(current_user: dict = Depends(get_current_user)):
    """
    Get the Lemon Squeezy Customer Portal URL for the current user.
    """
    customer_id = current_user.get("customer_id")
    
    # Generic fallback URL
    fallback_url = "https://app.lemonsqueezy.com/my-orders"

    if not customer_id:
        return {"portal_url": fallback_url}

    base_url = LEMON_API_URL.rstrip("/") 
    
    headers = {
        "Authorization": f"Bearer {LEMON_API_KEY}",
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json"
    }

    try:
        response = requests.get(
            f"{base_url}/customers/{customer_id}", 
            headers=headers
        )
        
        response.raise_for_status()
        data = response.json()
        
        portal_url = data['data']['attributes']['urls']['customer_portal']
        
        return {"portal_url": portal_url}

    except Exception as e:
        print(f"❌ Error obteniendo Portal URL: {e}")
        if 'response' in locals(): 
            print(f"Respuesta API: {response.text}")
            
        # Si falla (ej: el customer_id no existe en LS), devolvemos el link genérico
        return {"portal_url": fallback_url}