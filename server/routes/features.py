import csv
import io
import json
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from bson import ObjectId

# Import Local Modules
from config import groq_client  # Importamos el cliente Groq centralizado
from database import candidates_collection, get_all_candidates_from_db, db
from security import get_current_user
from schemas import CompareRequest, ChatRequest

router = APIRouter()

# Export Candidates as CSV
@router.get("/export-csv")
async def export_candidates_csv(current_user: dict = Depends(get_current_user)):
    # 1. Get Candidates
    user_id = str(current_user["_id"])
    candidates = get_all_candidates_from_db(user_id)

    if not candidates:
        raise HTTPException(status_code=404, detail="No hay datos para exportar")

    # 2. Create csv file in memory
    output = io.StringIO()
    writer = csv.writer(output)

    # 3. Wright Header
    writer.writerow(["ID", "Nombre", "Rol Detectado", "Puntaje (0-100)", "Estado", "Fecha Subida", "Skills"])

    # 4. Wright Data Rows
    for c in candidates:
        # Skills as comma-separated string
        skills_str = ", ".join(c.get("skills", []))
        
        writer.writerow([
            c.get("id"),
            c.get("name"),
            c.get("role"),
            c.get("score"),
            c.get("status"),
            c.get("date"),
            skills_str
        ])

    # 5. Downloadable Response
    output.seek(0)
    
    # Convert to BytesIO for StreamingResponse
    mem = io.BytesIO()
    mem.write(output.getvalue().encode('utf-8-sig')) # utf-8-sig para que Excel abra bien los acentos
    mem.seek(0)
    output.close()

    filename = f"veebot_candidates_{datetime.now().strftime('%Y%m%d')}.csv"
    
    return StreamingResponse(
        mem, 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# Seed Demo Data with Business Logic
@router.post("/seed")
async def seed_demo_data(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # 1. Get User Settings
    settings = current_user.get("settings", {})
    threshold = settings.get("min_score", 70)
    auto_reject_enabled = settings.get("auto_reject", False)

    # 2. DB Fake Candidates
    raw_candidates = [
        {
            "name": "Sofía Rodriguez",
            "role": "Frontend Developer",
            "score": 92,
            "summary": "Candidata excepcional con 6 años en React y Next.js. Ha liderado equipos y tiene experiencia en arquitecturas escalables.",
            "skills": ["React", "TypeScript", "Tailwind", "Figma", "Redux"],
            "text_preview": "Experiencia demostrable en startups unicornio...",
            "days_ago": 0
        },
        {
            "name": "Marcos Pérez",
            "role": "Backend Developer",
            "score": 85,
            "summary": "Sólido perfil Python/Django. Buena base de algoritmos, aunque le falta un poco de experiencia en microservicios.",
            "skills": ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
            "text_preview": "Desarrollador Backend enfocado en APIs REST...",
            "days_ago": 2
        },
        {
            "name": "Lucía Mendez",
            "role": "Data Scientist",
            "score": 74, 
            "summary": "Perfil académico fuerte (PhD), pero poca experiencia en producción real. Ideal para roles de investigación.",
            "skills": ["Python", "Pandas", "Scikit-Learn", "R", "SQL"],
            "text_preview": "Analista de datos con background matemático...",
            "days_ago": 5
        },
        {
            "name": "Juan Lopez",
            "role": "Full Stack Dev",
            "score": 45, 
            "summary": "Recién graduado de Bootcamp. Tiene los conceptos básicos pero el CV es muy genérico y carece de proyectos complejos.",
            "skills": ["HTML", "CSS", "Javascript", "Git"],
            "text_preview": "Entusiasta de la programación buscando primera oportunidad...",
            "days_ago": 1
        },
        {
            "name": "Carlos Ruiz",
            "role": "DevOps",
            "score": 88, 
            "summary": "Experto en Kubernetes y CI/CD. Perfil muy técnico y directo al grano. Muy valioso para infraestructura.",
            "skills": ["Kubernetes", "Terraform", "Jenkins", "Azure", "Linux"],
            "text_preview": "Ingeniero de confiabilidad del sitio (SRE)...",
            "days_ago": 3
        }
    ]

    processed_candidates = []

    # 3. Process Each Candidate According to User Settings
    for c in raw_candidates:
        score = c["score"]
        status = "Bajo Potencial"

        if score >= threshold:
            status = "Alto Potencial"
        elif score >= (threshold - 20):
            status = "Medio Potencial"
        else:
            status = "Rechazado Automático" if auto_reject_enabled else "Bajo Potencial"

        processed_candidates.append({
            "user_id": user_id,
            "filename": f"demo_{c['name'].lower().replace(' ', '_')}.pdf",
            "name": c["name"],
            "role": c["role"],
            "score": score,
            "status": status, 
            "summary": c["summary"],
            "skills": c["skills"],
            "text_preview": c["text_preview"],
            "upload_date": datetime.now() - timedelta(days=c["days_ago"])
        })

    try:
        candidates_collection.insert_many(processed_candidates)
        return {"message": "Datos de demostración cargados aplicando tus reglas."}
    except Exception as e:
        print(f"Error seeding: {e}")
        raise HTTPException(status_code=500, detail="Error al generar datos de prueba")


# Compare Two Candidates Using Llama 3
@router.post("/analyze/compare")
async def compare_candidates(data: CompareRequest, current_user: dict = Depends(get_current_user)):
    # Rol Validation
    if current_user.get("role") not in ["Premium", "Admin", "Reclutador"]:
        raise HTTPException(status_code=403, detail="Función exclusiva Premium.")

    try:
        # 1. Get Candidates from DB
        cand_a = db["candidates"].find_one({"_id": ObjectId(data.candidate_id_a)})
        cand_b = db["candidates"].find_one({"_id": ObjectId(data.candidate_id_b)})

        if not cand_a or not cand_b:
            raise HTTPException(status_code=404, detail="Uno de los candidatos no existe")

        # 2. Llama 3 Prompt Creation
        text_a = cand_a.get('text_preview', '')[:2000] 
        text_b = cand_b.get('text_preview', '')[:2000]
        
        prompt = f"""
        Actúa como un experto en Recursos Humanos Senior. Compara estos dos candidatos para un rol técnico genérico.
        
        CANDIDATO A ({cand_a.get('name')}):
        {text_a}
        
        CANDIDATO B ({cand_b.get('name')}):
        {text_b}
        
        Genera una respuesta en formato JSON PURO con esta estructura exacta (sin markdown):
        {{
            "winner": "A" o "B" (quien sea mejor técnicamente),
            "reason": "Frase corta y contundente de por qué ganó (máx 15 palabras).",
            "advantage_a": ["Ventaja 1", "Ventaja 2", "Ventaja 3"],
            "advantage_b": ["Ventaja 1", "Ventaja 2", "Ventaja 3"],
            "verdict": "Un párrafo de 2 líneas explicando la decisión final comparativa."
        }}
        """

        # 3. Groq API Call
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            response_format={"type": "json_object"} # Forzar JSON
        )

        response_content = chat_completion.choices[0].message.content
        return json.loads(response_content)

    except Exception as e:
        print(f"Error comparando: {e}")
        raise HTTPException(status_code=500, detail="Error en el análisis comparativo")
    
# Digital Twin Chat Simulation
@router.post("/simulate/chat")
async def chat_with_candidate(data: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        # 1. Get Candidate from DB
        candidate = db["candidates"].find_one({"_id": ObjectId(data.candidate_id)})
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidato no encontrado")

        resume_text = candidate.get('text_preview', '')[:4000] 
        candidate_name = candidate.get('filename', 'Candidato').split('.')[0]

        # 2. System Prompt
        system_prompt = f"""
        TÚ ERES "{candidate_name}". NO eres una IA. Eres la persona descrita en este CV:
        ---
        {resume_text}
        ---
        Instrucciones:
        1. Responde en primera persona ("Yo hice...", "Mi experiencia...").
        2. Basa tus respuestas ESTRICTAMENTE en la información del CV.
        3. Si te preguntan algo que no está en el CV, di que no tienes experiencia en eso.
        4. Mantén un tono profesional pero conversacional.
        5. IMPORTANTE: Sé conciso. Tus respuestas no deben exceder los 2 o 3 párrafos.
        6. Evita listas interminables a menos que sean necesarias.
        """

        # 3. Build Messages
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(data.history[-6:]) 
        messages.append({"role": "user", "content": data.message})

        # 4. Groq Chat Call
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024 
        )

        return {"response": chat_completion.choices[0].message.content}

    except Exception as e:
        print(f"Error chat simulation: {e}")
        raise HTTPException(status_code=500, detail="Error en la simulación")