import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId

# Local Imports
from config import SMTP_EMAIL, SMTP_PASSWORD
from database import db, users_collection
from security import get_current_user
from schemas import ReportRequest, EmailTemplateUpdate, SendTemplateRequest, ContactFormRequest

router = APIRouter()

# Send Email Routes
@router.post("/premium/send-report")
async def send_premium_report(data: ReportRequest, current_user: dict = Depends(get_current_user)):
    user_role = current_user.get("role", "Free")
    
    if user_role.lower() not in ["premium", "reclutador", "admin"]:
        raise HTTPException(
            status_code=403, 
            detail="Función exclusiva para usuarios Premium (Plan $29/mes)."
        )

    try:
        candidate = db["candidates"].find_one({"_id": ObjectId(data.candidate_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="ID de candidato inválido")

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    skills_list = candidate.get('skills', [])
    skills_str = ", ".join(skills_list) if isinstance(skills_list, list) else str(skills_list)
    score = candidate.get('score', 0)
    summary = candidate.get('summary', 'Sin resumen.')

    subject = f"Reporte VeeBot: {candidate['name']} ({score}/100)"
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Reporte de Talento VeeBot</h2>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <h3>👤 {candidate['name']}</h3>
          <p><strong>Rol:</strong> {candidate.get('role', 'N/A')}</p>
          <p><strong>Score:</strong> <b style="color: {'#16a34a' if score > 70 else '#dc2626'};">{score}/100</b></p>
          <div style="background:#f8fafc; padding:15px; border-radius:6px; margin:20px 0;">
            <p><strong>Skills:</strong> {skills_str}</p>
          </div>
          <h4>📝 Resumen:</h4>
          <p>{summary}</p>
          <p style="font-size:0.8em; color:#666; margin-top:30px;">Generado por VeeBot AI.</p>
        </div>
      </body>
    </html>
    """

    try:
        msg = MIMEMultipart()
        msg['From'] = f"VeeBot AI <{SMTP_EMAIL}>"
        msg['To'] = data.target_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()

        print(f"✅ Email enviado a {data.target_email}")
        return {"message": "Reporte enviado exitosamente"}

    except Exception as e:
        print(f"❌ Error SMTP: {e}")
        raise HTTPException(status_code=500, detail="Error enviando email")

# Email Template Routes
@router.get("/settings/templates")
async def get_email_templates(current_user: dict = Depends(get_current_user)):
    # Plantillas por defecto si el usuario no las ha configurado
    default_templates = {
        "rejection": {
            "subject": "Actualización sobre tu postulación - {company}",
            "body": "Hola {name},\n\nGracias por tu interés. Hemos revisado tu perfil de {role} y, aunque tu experiencia es impresionante, hemos decidido avanzar con otros candidatos.\n\nMantendremos tu CV en nuestra base de datos.\n\nSaludos,\nEl equipo de RRHH."
        },
        "interview": {
            "subject": "¡Buenas noticias! Entrevista para {role}",
            "body": "Hola {name},\n\nNos impresionó tu perfil y tu score de {score}/100. Nos gustaría invitarte a una primera entrevista.\n\nPor favor, responde a este correo con tu disponibilidad.\n\nSaludos,\n{company}"
        }
    }
    
    user_templates = current_user.get("email_templates", default_templates)
    return user_templates

@router.post("/settings/templates")
async def save_email_templates(data: EmailTemplateUpdate, current_user: dict = Depends(get_current_user)):
    try:
        users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"email_templates": data.templates}}
        )
        return {"message": "Plantillas guardadas correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/email/send-candidate")
async def send_candidate_email(data: SendTemplateRequest, current_user: dict = Depends(get_current_user)):
    # 1. Rol verification
    user_role = current_user.get("role", "Free")
    if user_role not in ["Premium", "Admin", "Reclutador"]:
        raise HTTPException(status_code=403, detail="Función Premium.")

    # 2. Get candidate
    try:
        candidate = db["candidates"].find_one({"_id": ObjectId(data.candidate_id)})
    except:
        raise HTTPException(status_code=404, detail="ID inválido")

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato no encontrado")

    # 3. Get templates
    templates = await get_email_templates(current_user)
    template = templates.get(data.template_type)
    if not template:
        raise HTTPException(status_code=400, detail="Plantilla no encontrada")

    # 4. Destiny email logic
    candidate_email = candidate.get("email")
    recruiter_email = current_user.get("email")
    
    if candidate_email and "@" in candidate_email:
        target_email = candidate_email
        print(f"📧 Enviando a candidato real: {target_email}")
    else:
        target_email = recruiter_email
        print(f"⚠️ Candidato sin email detectado. Enviando copia a reclutador: {target_email}")

    # 5. Replace placeholders
    replacements = {
        "{name}": candidate.get("name", "Candidato"),
        "{role}": candidate.get("role", "Postulante"),
        "{score}": str(candidate.get("score", 0)),
        "{company}": "VeeBot Corp" # O current_user.get("company", "Tu Empresa")
    }

    subject = template["subject"]
    body = template["body"]

    for key, value in replacements.items():
        subject = subject.replace(key, value)
        body = body.replace(key, value)

    body_html = body.replace("\n", "<br>")
    
    # Footer HTML
    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <p>{body_html}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">
            Este mensaje fue enviado automáticamente a través de la plataforma de reclutamiento VeeBot AI.<br>
            Si crees que esto es un error, por favor ignora este mensaje.
        </p>
    </div>
    """

    # 6. Smtp Send
    try:
        msg = MIMEMultipart()
        msg['From'] = f"VeeBot Recruiting <{SMTP_EMAIL}>"
        msg['To'] = target_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()

        return {"message": f"Correo enviado correctamente a {target_email}"}

    except Exception as e:
        print(f"❌ Error SMTP: {e}")
        raise HTTPException(status_code=500, detail="Error de conexión con el servidor de correo")

# Contact Form Route
@router.post("/contact")
async def contact_support(data: ContactFormRequest):
    """
    Get contact form submissions and send them to the support email.
    """
    try:
        # Mail Header
        subject = f"🔔 Nuevo Mensaje de Contacto: {data.firstName} {data.lastName}"
        
        # Mail HTML Content
        html_content = f"""
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4f46e5;">Tienes un nuevo contacto</h2>
            <p>Un usuario ha enviado un mensaje a través del formulario de VeeBot.</p>
            
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
            
            <p><strong>👤 Nombre:</strong> {data.firstName} {data.lastName}</p>
            <p><strong>📧 Email del Usuario:</strong> {data.email}</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 10px;">
                <strong>💬 Mensaje:</strong><br>
                {data.message}
            </div>
            
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
            <p style="font-size:12px; color:#888;">Este correo fue generado automáticamente por tu sistema VeeBot.</p>
        </div>
        """

        msg = MIMEMultipart()
        msg['From'] = f"VeeBot Contact Form <{SMTP_EMAIL}>"
        msg['To'] = SMTP_EMAIL 
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html'))

        # SMTP Send
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()

        return {"message": "Mensaje enviado al soporte"}

    except Exception as e:
        print(f"❌ Error en formulario de contacto: {e}")
        raise HTTPException(status_code=500, detail="Error interno al enviar mensaje")