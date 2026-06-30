import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai as google_genai

# Load .env file
# Route config: server/config.py -> parent = server/ -> parent.parent = root/
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

#Mongo Config 
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "veebot-db")

#Services Config -- Lemon Squeezy (Payments)
LEMON_API_KEY = os.getenv("LEMON_API_KEY")
LEMON_STORE_ID = os.getenv("LEMON_STORE_ID")
LEMON_VARIANT_ID = os.getenv("LEMON_VARIANT_ID")
LEMON_WEBHOOK_SECRET = os.getenv("LEMON_WEBHOOK_SECRET")
LEMON_API_URL = os.getenv("LEMON_API_URL", "https://api.lemonsqueezy.com/v1")

# Pinecone Config (Vector DB)
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# SMTP Config (Email Service)
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Gemini Config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

if not GEMINI_API_KEY:
    print("⚠️ ADVERTENCIA: No se encontró GEMINI_API_KEY en el archivo .env")
else:
    print(f"✅ GEMINI_API_KEY cargada correctamente (últimos 4 chars: ...{GEMINI_API_KEY[-4:]})")

# Initialize Gemini client (google-genai SDK)
gemini_client = google_genai.Client(api_key=GEMINI_API_KEY)