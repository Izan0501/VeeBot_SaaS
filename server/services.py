import os
import json
import re
from groq import Groq
from pinecone import Pinecone
from dotenv import load_dotenv
import pdfplumber

load_dotenv()

# Configuración de Clientes
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("recruit-index") # Asegúrate que este sea el nombre de tu índice

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def process_and_store_cv(text, filename, candidate_name):
    # Crear embedding (Simulado o real con otro modelo si tienes)
    # Para este ejemplo usamos un vector dummy o una llamada a un modelo de embeddings real
    # Nota: Groq no tiene embeddings nativos aún, se suele usar OpenAI o HuggingFace.
    # Aquí simularemos el vector para que no falle Pinecone, pero idealmente usas:
    # vector = openai.embeddings.create(input=text, model="text-embedding-3-small").data[0].embedding
    
    # Vector Dummy de 1536 dimensiones (estándar de OpenAI)
    vector = [0.1] * 1536 
    
    # Guardar en Pinecone
    index.upsert(
        vectors=[
            {
                "id": filename,
                "values": vector,
                "metadata": {"text": text[:5000], "name": candidate_name} # Guardamos trozo de texto
            }
        ]
    )

def analyze_candidate_with_groq(query, candidates_context):
    
    system_prompt = f"""
    Eres VeeBot, un Consultor de Talentos Senior experto en tecnología.
    
    BASE DE DATOS DE CANDIDATOS:
    -----------------------------------------
    {candidates_context}
    -----------------------------------------
    
    INSTRUCCIONES CLAVE:
    1.  **ANÁLISIS DE SKILLS:** Fíjate bien en el campo "STACK TÉCNICO" de cada candidato. Si el usuario pregunta por "React", busca quién tiene "React" en su lista.
    2.  **JUSTIFICACIÓN:** Cuando recomiendes a alguien, menciona qué tecnologías de su stack coinciden con lo pedido.
    3.  **COMPARATIVA:** Si dos candidatos tienen la misma tecnología, usa el "Score" para desempatar.
    4.  **RESUMEN:** Sé profesional y directo.
    """

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            temperature=0.3, 
            max_tokens=1024,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error consultando a la IA: {str(e)}"


def get_ai_score(text, model_name="llama-3.3-70b-versatile"): 
    
    # PROMPT HÍBRIDO: ESTRICTO + EXTRACTOR TÉCNICO
    prompt = f"""
    Actúa como un Senior Technical Recruiter en una empresa tecnológica de élite. 
    Tu trabajo es filtrar candidatos despiadadamente y extraer sus datos técnicos.
    
    CV DEL CANDIDATO (TEXTO):
    {text[:6000]} 
    
    INSTRUCCIONES DE EVALUACIÓN (RUTHLESS MODE):
    1.  **FILTRO DE NICHO (KILL SWITCH):** Si el candidato NO es del área de Tecnología, Desarrollo de Software, Datos o IT, su Score DEBE ser menor a 20. (Ej: Chef, Vendedor, Abogado -> Score 10).
    2.  **SKILLS (CRÍTICO):** Extrae un Array con todas las tecnologías, lenguajes y herramientas mencionadas (Ej: ["React", "Python", "AWS"]).
    3.  **EXPERIENCIA:** Valora experiencia comprobable en proyectos reales.
    
    ESCALA DE PUNTUACIÓN OBLIGATORIA:
    - 0-20: Perfil irrelevante / No Tech / Spam.
    - 21-50: Junior básico / Trainee.
    - 51-75: Mid-level / Estándar.
    - 76-90: Senior fuerte / Muy relevante.
    - 91-100: Unicornio / Experto.

    SALIDA REQUERIDA (JSON PURO):
    {{
        "role": "Rol técnico detectado (ej: Full Stack, DevOps)",
        "score": (Número entero 0-100),
        "skills": ["Tech1", "Tech2", "Tech3"...],
        "summary": "Justificación técnica y honesta de 2 líneas."
    }}
    """

    try:
        completion = groq_client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "Eres un motor de análisis que responde SOLO JSON válido."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0, # Lógica fría, sin alucinaciones
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        
        # --- BLINDAJE CONTRA ERRORES DE PARSEO ---
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # Rescate con Regex por si la IA mete texto extra
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            else:
                raise ValueError("No se encontró JSON válido")

    except Exception as e:
        print(f"Error en Groq Analysis: {e}")
        # Fallback seguro que incluye skills vacío para no romper el front
        return {
            "role": "Error de Procesamiento", 
            "score": 0, 
            "skills": [], 
            "summary": "No se pudo procesar el archivo."
        }