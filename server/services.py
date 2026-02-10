import os
import json
import requests
import time
from datetime import datetime, timedelta
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from groq import Groq

# Import Locals
from config import GROQ_API_KEY, PINECONE_API_KEY, PINECONE_INDEX_NAME
from database import candidates_collection

# Services for Vector DB (Pinecone) and AI (GROQ)
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# Embedding Model Initialization
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Vectorial Logic (Pinecone)
def get_embedding(text):
    """
    Generate embedding vector from text using SentenceTransformer.
    """
    try:
        text = text.replace("\n", " ")
        
        vector = embedding_model.encode(text).tolist()
        return vector
    except Exception as e:
        print(f"❌ Error generando embedding: {e}")
        return None

def process_and_store_cv(text, mongo_id, vector_id, user_id):
    # 1. Generar Embedding
    vector = get_embedding(text)
    if not vector:
        return

    # 2. Preparar Metadata
    metadata = {
        "mongo_id": str(mongo_id),
        "text": text[:1000] # Guardamos un snippet del texto
    }

    # 3. Subir a Pinecone (UPSERT)
    try:
        # --- AQUÍ ESTÁ LA CLAVE ---
        # Debes pasar namespace=user_id. Si no lo haces, se guarda en "default"
        # y luego el delete(namespace=user_id) no encontrará nada.
        index.upsert(
            vectors=[(vector_id, vector, metadata)], 
            namespace=user_id 
        )
        print(f"✅ Vector guardado en namespace {user_id}: {vector_id}")
    except Exception as e:
        print(f"❌ Error subiendo a Pinecone: {e}")

def delete_user_vectors(user_id):
    """
    Delete all vectors in Pinecone associated with a specific user_id.
    """
    try:
        #Delete by filter
        index.delete(filter={"user_id": user_id})
        return True
    except Exception as e:
        print(f"Error borrando vectores Pinecone: {e}")
        return False

# AI Integration (GROQ)
def raw_groq_request(messages, model="llama-3.3-70b-versatile", json_mode=False):
  
    api_key = GROQ_API_KEY or os.getenv("GROQ_API_KEY", "").strip()
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.1
    }
    if json_mode: payload["response_format"] = {"type": "json_object"}

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            
            elif response.status_code == 429:
                wait_time = 2 * (attempt + 1)
                print(f"⚠️ Rate Limit de Groq. Reintentando en {wait_time}s...")
                time.sleep(wait_time)
                continue 
            
            else:
                raise Exception(f"Error Groq {response.status_code}: {response.text}")
                
        except Exception as e:
            if attempt == max_retries - 1: 
                print(f"Error final en request: {e}")
                raise e
            time.sleep(1)

def get_ai_score(text, model_name="llama-3.3-70b-versatile"): 
    # Prompt 
    prompt = f"""
    Actúa como un Engineering Manager escéptico y cínico que odia contratar a la persona equivocada.
    Tu trabajo es AUDITAR este CV para detectar incompetencia, relleno de palabras clave (keyword stuffing) y falta de experiencia real.

    CV DEL CANDIDATO (TEXTO CRUDO):
    ---------------------------------------------------
    {text[:6000]} 
    ---------------------------------------------------

    SISTEMA DE PUNTUACIÓN (BASE 0 - EL CANDIDATO EMPIEZA CON CERO PUNTOS):
    Debes sumar puntos SOLO si hay EVIDENCIA explícita. No asumas nada.

    1. NIVEL DE EXPERIENCIA (Máx 40 puntos):
       - +0 pts: Sin experiencia laboral real (solo cursos/bootcamps).
       - +10 pts: Proyectos freelance pequeños o pasantías (< 6 meses).
       - +20 pts: 1-2 años en empresas reales.
       - +40 pts: 3+ años demostrables con fechas claras.

    2. PROFUNDIDAD TÉCNICA (Máx 30 puntos):
       - +0 pts: Solo lista lenguajes ("Javascript, Python") sin contexto.
       - +10 pts: Menciona tecnologías en descripciones vagas.
       - +30 pts: Explica CÓMO usó la tecnología para resolver un problema difícil (Arquitecutra, Optimización).

    3. IMPACTO (Máx 30 puntos):
       - +0 pts: Tareas genéricas ("Mantenimiento de base de datos").
       - +15 pts: Logros específicos ("Creé una API REST").
       - +30 pts: Métricas de negocio ("Reduje costos 15%", "Escale a 10k usuarios").

    PENALIZACIONES (RESTAS PUNTOS):
    - -50 pts: Si el CV parece generado por IA, tiene errores graves, o es de una profesión no tecnológica (ej: Chofer, Cocinero).
    - -20 pts: Si tiene "Job Hopping" extremo (cambia cada 3 meses).
    - -10 pts: Si lista habilidades irrelevantes para rellenar (ej: "Microsoft Word" para un dev).

    EJEMPLO DE CALIBRACIÓN:
    - Un Junior salido de Bootcamp debe tener score entre 20 y 40.
    - Un CV malo o vacío debe tener score < 20.
    - Un Senior real debe tener score > 80.

    SALIDA JSON ESTRICTA:
    {{
        "role": "Rol técnico inferido (o 'No Técnico')",
        "score": (Número entero 0-100 calculado fríamente),
        "skills": ["Lista", "Limpia", "Skills"],
        "summary": "Explica BRUTALMENTE por qué obtuvo este puntaje. Menciona qué le falta."
    }}
    """

    try:
        content = raw_groq_request(
            messages=[
                {"role": "system", "content": "Eres un auditor de CVs estricto. No tienes piedad. Respondes solo JSON."},
                {"role": "user", "content": prompt}
            ],
            model=model_name,
            json_mode=True
        )
        return json.loads(content)

    except Exception as e:
        print(f"Error AI: {e}")
        return {
            "role": "Error de Análisis", 
            "score": 0, 
            "skills": [], 
            "summary": "No se pudo procesar el CV debido a un error técnico."
        }

def analyze_candidate_with_groq(query, candidates_context):
    api_key = os.getenv("GROQ_API_KEY")
    
    # --- AGREGA ESTO PARA DEPURAR ---
    print(f"🔍 DEBUG GROQ KEY EN USO: '{api_key}'") 
    # (Tranquilo, esto solo sale en tu consola local)
    
    if not api_key:
        print("❌ ERROR: La API Key está vacía o es None")
        return "Error: No hay API Key configurada."
    
    system_prompt = f"""
    Eres VeeBot, un asistente experto en reclutamiento.
    
    CONTEXTO DE CANDIDATOS (Base de Datos):
    {candidates_context}
    
    INSTRUCCIONES:
    1. Responde basándote SOLO en la información provista arriba.
    2. Si te preguntan por un candidato específico, cita sus habilidades y score.
    3. Si la pregunta es comparativa, sé objetivo y usa los scores como referencia.
    4. Mantén un tono profesional pero conversacional.
    """
    try:
        return raw_groq_request(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ]
        )
    except Exception as e:
        return f"Error consultando a la IA: {str(e)}"

def chat_as_candidate(candidate_name, full_cv_text, user_query):
    """
    Simula ser el candidato usando su CV completo como base de conocimiento.
    """
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    client = Groq(api_key=api_key)

    # Construimos un System Prompt robusto
    system_prompt = f"""
    Eres {candidate_name}, un candidato en una entrevista.
    
    AQUÍ ESTÁ TU CV REAL (Información Fuente):
    =========================================
    {full_cv_text}
    =========================================
    
    INSTRUCCIONES CRÍTICAS:
    1. Responde USANDO EXCLUSIVAMENTE la información del CV de arriba.
    2. Cita ejemplos concretos del texto (empresas, fechas, tecnologías usadas en cada proyecto).
    3. Si el CV dice "Trabajé en Google usando Python", TÚ dices "En mi experiencia en Google utilicé Python para...".
    4. NO uses frases como "No tengo detalles". BUSCA LOS DETALLES EN EL TEXTO DE ARRIBA.
    5. NO inventes proyectos ni experiencias genéricas.
    6. Si te preguntan por una tecnología o proyecto que NO está en tu CV, di honestamente: "No tengo experiencia específica en eso mencionada en mi CV, pero puedo aprender."
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            model="llama-3.3-70b-versatile", # Modelo potente para razonamiento
            temperature=0.7, # Un poco de creatividad para la conversación
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error en Groq Chat: {e}")
        return "Disculpa, tuve un problema procesando tu pregunta."
    
# Secondary Maintenance Service
def cleanup_expired_candidates():
    # Cleanup candidates older than 25 days
    days_limit = 25
    expiration_date = datetime.utcnow() - timedelta(days=days_limit)
    
    print(f"🧹 [AUTO-CLEANUP] Buscando archivos anteriores a {expiration_date.strftime('%Y-%m-%d')}...")

    try:
        expired_cursor = candidates_collection.find({"upload_date": {"$lt": expiration_date}})
        expired_candidates = list(expired_cursor)
        
        if not expired_candidates:
            print("✅ [AUTO-CLEANUP] Sistema limpio. No hay expirados.")
            return

        print(f"⚠️ [AUTO-CLEANUP] Encontrados {len(expired_candidates)} candidatos viejos.")

        pinecone_ids_to_delete = []
        mongo_ids_to_delete = []

        for candidate in expired_candidates:
            pinecone_ids_to_delete.append(str(candidate["_id"]))
            
            mongo_ids_to_delete.append(candidate["_id"])

        if pinecone_ids_to_delete:
            try:
                batch_size = 100
                for i in range(0, len(pinecone_ids_to_delete), batch_size):
                    batch = pinecone_ids_to_delete[i:i + batch_size]
                    index.delete(ids=batch)
                
                print(f"🗑️ [PINECONE] {len(pinecone_ids_to_delete)} vectores eliminados.")
            except Exception as e:
                print(f"❌ [PINECONE ERROR] {e}")

        if mongo_ids_to_delete:
            result = candidates_collection.delete_many({"_id": {"$in": mongo_ids_to_delete}})
            print(f"🗑️ [MONGO] {result.deleted_count} documentos eliminados.")

        print("✨ [AUTO-CLEANUP] Ciclo finalizado.")

    except Exception as e:
        print(f"❌ [AUTO-CLEANUP ERROR] Fallo crítico: {e}")