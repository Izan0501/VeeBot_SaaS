# server/init_db.py
import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import time

load_dotenv()

# Configuración
api_key = os.getenv("PINECONE_API_KEY")
index_name = "recruit-index"

if not api_key:
    print("❌ Error: No se encontró PINECONE_API_KEY en el archivo .env")
    exit()

pc = Pinecone(api_key=api_key)

print(f"🔍 Verificando índice '{index_name}'...")

# Verificar si existe
existing_indexes = pc.list_indexes().names()

if index_name not in existing_indexes:
    print(f"⚙️ Creando índice '{index_name}' (Esto puede tardar unos segundos)...")
    try:
        pc.create_index(
            name=index_name,
            dimension=1536, # Estándar para embeddings de texto
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        print("✅ Índice creado exitosamente.")
    except Exception as e:
        print(f"❌ Error creando el índice: {e}")
else:
    print("✅ El índice ya existe.")

# Esperar a que esté listo
while not pc.describe_index(index_name).status['ready']:
    time.sleep(1)

print("🚀 Pinecone listo para usar.")