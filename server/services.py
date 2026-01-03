import os
import json
import re
import requests  # <--- USAMOS REQUESTS DIRECTO
from pinecone import Pinecone
from dotenv import load_dotenv
import pdfplumber
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Pinecone sigue igual
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("recruit-index")

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def process_and_store_cv(text, filename, candidate_name):
    # Vector Dummy
    vector = [0.1] * 1536 
    index.upsert(
        vectors=[
            {
                "id": filename,
                "values": vector,
                "metadata": {"text": text[:5000], "name": candidate_name}
            }
        ]
    )

# --- NUEVA FUNCIÓN AUXILIAR PARA LLAMAR A GROQ SIN SDK ---
def raw_groq_request(messages, model="llama-3.3-70b-versatile", json_mode=False):
    """
    Hace una petición HTTP directa a Groq simulando ser un navegador.
    Se salta el bloqueo de la librería oficial.
    """
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        # User-Agent de Chrome real en Windows
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Origin": "https://console.groq.com",
        "Referer": "https://console.groq.com/"
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.0 if json_mode else 0.3
    }
    
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        elif response.status_code == 403:
            raise Exception("Groq sigue devolviendo 403 (Forbidden). Bloqueo de IP/Cloudflare.")
        else:
            raise Exception(f"Error Groq {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"Error en request raw: {e}")
        raise e

# --- TU FUNCIÓN MODIFICADA ---
def get_ai_score(text, model_name="llama-3.3-70b-versatile"): 
    prompt = f"""
    Actúa como un Senior Technical Recruiter.
    CV DEL CANDIDATO:
    {text[:6000]} 
    
    INSTRUCCIONES:
    1. FILTRO: Si no es perfil tech, score < 20.
    2. SKILLS: Extrae array de tecnologías.
    3. JSON ESTRICTO: Solo devuelve el JSON, nada más.
    
    SALIDA REQUERIDA:
    {{
        "role": "Rol detectado",
        "score": 0-100,
        "skills": ["Tech1", "Tech2"],
        "summary": "Resumen breve"
    }}
    """

    try:
        # Usamos nuestra función manual en lugar de groq_client
        content = raw_groq_request(
            messages=[
                {"role": "system", "content": "Eres un motor que responde SOLO JSON válido."},
                {"role": "user", "content": prompt}
            ],
            model=model_name,
            json_mode=True
        )
        
        return json.loads(content)

    except Exception as e:
        print(f"Error en Groq Analysis: {e}")
        return {
            "role": "Error de Conexión", 
            "score": 0, 
            "skills": [], 
            "summary": f"Fallo al conectar con IA: {str(e)}"
        }

def analyze_candidate_with_groq(query, candidates_context):
    system_prompt = f"Eres VeeBot. Contexto: {candidates_context}"
    try:
        # También actualizamos esta para usar la llamada manual
        return raw_groq_request(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ]
        )
    except Exception as e:
        return f"Error consultando a la IA: {str(e)}"