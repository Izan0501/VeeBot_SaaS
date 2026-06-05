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

# ─────────────────────────────────────────────────────────────
# EMAIL BUILDER  (tabla-based, Outlook-safe)
# ─────────────────────────────────────────────────────────────
def _email_html(body_rows: str, footer_note: str = "") -> str:
    """
    Genera el wrapper HTML de VeeBot.
    Compatible con Gmail, Outlook, Apple Mail (inline styles + table layout).
    """
    footer_text = footer_note or (
        "Este correo fue enviado automáticamente por "
        "<strong style='color:#6366f1;'>VeeBot AI</strong>, "
        "plataforma de reclutamiento inteligente.<br>"
        "Si crees que esto es un error, ignóralo con tranquilidad."
    )
    return f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#eef0f8;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef0f8">
  <tr>
    <td align="center" style="padding:40px 16px;">

      <!-- MAIN CARD -->
      <table width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;width:100%;background:#ffffff;
                    border-radius:20px;overflow:hidden;
                    box-shadow:0 8px 48px rgba(30,27,75,0.18);">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#1e1b4b" align="center" style="padding:44px 40px 36px;">

            <!-- Logo orb -->
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="60" height="60" bgcolor="#6366f1"
                    align="center" valign="middle"
                    style="border-radius:16px;">
                  <span style="font-family:Georgia,'Times New Roman',serif;
                               font-size:28px;font-weight:bold;
                               color:#ffffff;line-height:60px;
                               display:block;">V</span>
                </td>
              </tr>
            </table>

            <!-- Brand wordmark -->
            <p style="font-family:Georgia,'Times New Roman',serif;
                      font-size:32px;font-weight:bold;
                      color:#ffffff;letter-spacing:-0.5px;
                      margin:16px 0 4px 0;line-height:1;">
              VeeBot
            </p>
            <p style="font-family:Arial,Helvetica,sans-serif;
                      font-size:10px;color:rgba(255,255,255,0.45);
                      letter-spacing:4px;text-transform:uppercase;
                      margin:0;">
              AI&nbsp;Recruiter
            </p>
          </td>
        </tr>

        <!-- ACCENT LINE -->
        <tr><td height="4" bgcolor="#6366f1"></td></tr>

        <!-- DYNAMIC BODY ROWS -->
        {body_rows}

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#f4f4fc"
              style="padding:28px 40px;
                     border-top:1px solid #e8e8f4;">
            <p style="font-family:Arial,Helvetica,sans-serif;
                      font-size:12px;color:#9090b8;
                      text-align:center;margin:0;
                      line-height:1.7;">
              {footer_text}
            </p>
          </td>
        </tr>

      </table>
      <!-- /MAIN CARD -->

    </td>
  </tr>
</table>

</body></html>
"""

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

    subject = f"Reporte de Talento VeeBot \u2014 {candidate['name']}"

    score_pct   = min(max(score, 0), 100)
    bar_color   = "#16a34a" if score_pct >= 75 else ("#f59e0b" if score_pct >= 50 else "#ef4444")
    score_label = "Excelente" if score_pct >= 75 else ("Bueno" if score_pct >= 50 else "Bajo")
    skills_badges = "".join(
        f'<td style="padding:4px;"><span style="display:inline-block;background:#ede9fe;color:#6d28d9;'
        f'font-family:Arial,sans-serif;font-size:12px;font-weight:600;padding:4px 12px;'
        f'border-radius:20px;white-space:nowrap;">{s}</span></td>'
        for s in (skills_list[:8] if isinstance(skills_list, list) else [])
    )
    body_rows = (
        "<tr><td style='padding:40px 40px 0;'>"
        f"<p style='font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#6366f1;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;'>Reporte de Talento</p>"
        f"<p style='font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#1e1b4b;margin:0 0 4px;'>{candidate['name']}</p>"
        f"<p style='font-family:Arial,sans-serif;font-size:14px;color:#6b7280;margin:0;'>{candidate.get('role','Sin rol')}</p>"
        "</td></tr>"
        "<tr><td style='padding:28px 40px 0;'>"
        "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='background:#f8f8fc;border-radius:12px;padding:20px;'><tr><td>"
        "<table width='100%' cellpadding='0' cellspacing='0' border='0'><tr>"
        "<td style='font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#374151;'>Score IA</td>"
        f"<td align='right' style='font-family:Georgia,serif;font-size:22px;font-weight:bold;color:{bar_color};'>{score_pct}/100 "
        f"<span style='font-family:Arial,sans-serif;font-size:11px;font-weight:600;color:{bar_color};'>({score_label})</span></td>"
        "</tr></table>"
        f"<table width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-top:12px;background:#e5e7eb;border-radius:99px;overflow:hidden;height:8px;'><tr>"
        f"<td width='{score_pct}%' height='8' bgcolor='{bar_color}' style='border-radius:99px;'></td>"
        f"<td width='{100-score_pct}%'></td>"
        "</tr></table>"
        "</td></tr></table></td></tr>"
        "<tr><td style='padding:24px 40px 0;'>"
        "<p style='font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#9090b8;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;'>Habilidades detectadas</p>"
        f"<table cellpadding='0' cellspacing='0' border='0'><tr>{skills_badges}</tr></table>"
        "</td></tr>"
        "<tr><td style='padding:24px 40px 40px;'>"
        "<p style='font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#9090b8;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;'>Resumen del perfil</p>"
        f"<p style='font-family:Arial,sans-serif;font-size:15px;color:#374151;line-height:1.75;margin:0;border-left:3px solid #6366f1;padding-left:16px;'>{summary}</p>"
        "</td></tr>"
    )
    html_content = _email_html(
        body_rows,
        footer_note="Reporte generado por <strong style='color:#6366f1;'>VeeBot AI</strong>. Solo para uso interno del equipo de reclutamiento."
    )

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

    if data.status:
        db["candidates"].update_one(
            {"_id": ObjectId(data.candidate_id)},
            {"$set": {"status": data.status}}
        )

    # 3. Get templates
    templates = await get_email_templates(current_user)
    template = templates.get(data.template_type)
    if not template:
        raise HTTPException(status_code=400, detail="Plantilla no encontrada")

    # 4. Destiny email logic
    candidate_email = data.email or candidate.get("email")
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

    body_html = body.replace("\n", "</p><p style='font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;line-height:1.8;margin:0 0 16px;'>")

    body_rows = f"""
        <!-- GREETING -->
        <tr>
          <td style="padding:44px 40px 0;">
            <p style="font-family:Georgia,'Times New Roman',serif;
                      font-size:20px;font-weight:bold;
                      color:#1e1b4b;margin:0 0 28px;
                      letter-spacing:-0.2px;">
              Hola, {candidate.get('name', 'Candidato').split()[0]} 👋
            </p>
            <p style="font-family:Arial,Helvetica,sans-serif;
                      font-size:15px;color:#374151;
                      line-height:1.8;margin:0 0 16px;">
              {body_html}
            </p>
          </td>
        </tr>

        <!-- CANDIDATE CHIP -->
        <tr>
          <td style="padding:28px 40px;">
            <table cellpadding="0" cellspacing="0" border="0"
                   style="background:#f4f4fc;border-radius:12px;width:100%;">
              <tr>
                <td style="padding:20px 24px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td width="40" height="40" bgcolor="#6366f1"
                          align="center" valign="middle"
                          style="border-radius:10px;">
                        <span style="font-family:Georgia,serif;
                                     font-size:18px;font-weight:bold;
                                     color:#fff;display:block;
                                     line-height:40px;">
                          {candidate.get('name','?')[0].upper()}
                        </span>
                      </td>
                      <td style="padding-left:14px;">
                        <p style="font-family:Arial,sans-serif;
                                  font-size:15px;font-weight:700;
                                  color:#1e1b4b;margin:0;">
                          {candidate.get('name', 'Candidato')}
                        </p>
                        <p style="font-family:Arial,sans-serif;
                                  font-size:13px;color:#6b7280;
                                  margin:2px 0 0;">
                          {candidate.get('role', 'Postulante')}
                        </p>
                      </td>
                      <td align="right" valign="middle">
                        <span style="font-family:Arial,sans-serif;
                                     font-size:11px;font-weight:700;
                                     color:#6366f1;letter-spacing:1.5px;
                                     text-transform:uppercase;
                                     background:#ede9fe;padding:4px 10px;
                                     border-radius:20px;">
                          Score {candidate.get('score', '?')}/100
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
    """

    html_content = _email_html(body_rows)

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
        contact_body_rows = f"""
        <tr>
          <td style="padding:40px 40px 0;">
            <p style="font-family:Arial,sans-serif;font-size:12px;
                      font-weight:700;color:#6366f1;
                      letter-spacing:3px;text-transform:uppercase;
                      margin:0 0 8px;">Nuevo mensaje de contacto</p>
            <p style="font-family:Georgia,serif;font-size:22px;
                      font-weight:bold;color:#1e1b4b;
                      margin:0 0 24px;letter-spacing:-0.2px;">
              {data.firstName} {data.lastName}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background:#f4f4fc;border-radius:12px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="font-family:Arial,sans-serif;font-size:12px;
                            color:#9090b8;font-weight:700;
                            letter-spacing:2px;text-transform:uppercase;
                            margin:0 0 4px;">Email</p>
                  <p style="font-family:Arial,sans-serif;font-size:14px;
                            color:#374151;margin:0;font-weight:600;">
                    {data.email}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 40px;">
            <p style="font-family:Arial,sans-serif;font-size:12px;
                      font-weight:700;color:#9090b8;
                      letter-spacing:2px;text-transform:uppercase;
                      margin:0 0 12px;">Mensaje</p>
            <p style="font-family:Arial,sans-serif;font-size:15px;
                      color:#374151;line-height:1.8;margin:0;
                      border-left:3px solid #6366f1;
                      padding-left:16px;">
              {data.message}
            </p>
          </td>
        </tr>
        """
        html_content = _email_html(contact_body_rows, footer_note="Mensaje recibido a través del formulario de contacto de <strong style='color:#6366f1;'>VeeBot AI</strong>.")

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