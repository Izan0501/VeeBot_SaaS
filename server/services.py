import os
import json
import re
import requests
from pinecone import Pinecone
from dotenv import load_dotenv
import pdfplumber
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("recruit-index")

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def process_and_store_cv(text, filename, candidate_name, user_id):
    # Vector Dummy
    vector = [0.1] * 1536 
    
    # GUARDAMOS CON METADATA USER_ID PARA FILTRAR DESPUÉS
    index.upsert(
        vectors=[
            {
                "id": filename, 
                "values": vector,
                "metadata": {
                    "text": text[:5000], 
                    "name": candidate_name,
                    "user_id": user_id 
                }
            }
        ]
    )

# --- LLAMADA A GROQ ---
def raw_groq_request(messages, model="llama-3.3-70b-versatile", json_mode=False):
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.1 # Bajamos temperatura para ser más fríos y analíticos
    }
    
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            raise Exception(f"Error Groq {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Error en request raw: {e}")
        raise e

def get_ai_score(text, model_name="llama-3.3-70b-versatile"): 
    # --- PROMPT: MODO "AUDITOR CÍNICO" ---
    # Cambiamos la lógica: No evalúes "potencial", evalúa "evidencia actual".
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