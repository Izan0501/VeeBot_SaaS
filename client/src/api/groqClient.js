import Groq from 'groq-sdk';

// El cliente de Groq se inicializa con la key del .env del cliente (prefijo VITE_)
// dangerouslyAllowBrowser: true es necesario para llamadas desde el browser
const groqClient = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Compara dos candidatos usando sus datos y retorna un análisis JSON.
 */
export async function compareWithGroq(candidateA, candidateB) {
    const prompt = `
        Actúa como un experto en Recursos Humanos Senior. Compara estos dos candidatos para un rol técnico genérico.
        
        CANDIDATO A (${candidateA.name}):
        Rol: ${candidateA.role}
        Score: ${candidateA.score}/100
        Skills: ${(candidateA.skills || []).join(', ')}
        Resumen: ${candidateA.summary || ''}
        
        CANDIDATO B (${candidateB.name}):
        Rol: ${candidateB.role}
        Score: ${candidateB.score}/100
        Skills: ${(candidateB.skills || []).join(', ')}
        Resumen: ${candidateB.summary || ''}
        
        Genera una respuesta en formato JSON PURO con esta estructura exacta (sin markdown):
        {
            "winner": "A" o "B" (quien sea mejor técnicamente),
            "reason": "Frase corta y contundente de por qué ganó (máx 15 palabras).",
            "advantage_a": ["Ventaja 1", "Ventaja 2", "Ventaja 3"],
            "advantage_b": ["Ventaja 1", "Ventaja 2", "Ventaja 3"],
            "verdict": "Un párrafo de 2 líneas explicando la decisión final comparativa."
        }
    `;

    const completion = await groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: MODEL,
        temperature: 0.5,
        response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content);
}

/**
 * Chat del dashboard — conoce todos los candidatos del usuario.
 */
export async function dashboardChatWithGroq(query, candidatesList) {
    let contextText = '';
    if (!candidatesList || candidatesList.length === 0) {
        contextText = 'El usuario no tiene candidatos cargados aún. Ayúdalo con dudas generales de RRHH.';
    } else {
        contextText = 'Tengo acceso a los siguientes candidatos en mi base de datos:\n';
        candidatesList.forEach(c => {
            const skills = (c.skills || []).slice(0, 5).join(', ');
            contextText += `- ${c.name} (${c.role}): Score ${c.score}. Skills: ${skills}.\n`;
        });
    }

    const systemPrompt = `
        Eres VeeBot, un asistente experto en reclutamiento.
        
        CONTEXTO DE CANDIDATOS (Base de Datos):
        ${contextText}
        
        INSTRUCCIONES:
        1. Responde basándote SOLO en la información provista arriba.
        2. Si te preguntan por un candidato específico, cita sus habilidades y score.
        3. Si la pregunta es comparativa, sé objetivo y usa los scores como referencia.
        4. Mantén un tono profesional pero conversacional.
    `;

    const completion = await groqClient.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
        ],
        model: MODEL,
        temperature: 0.7,
    });

    return completion.choices[0].message.content;
}

/**
 * Digital Twin — simula ser el candidato usando su CV completo.
 */
export async function digitalTwinChatWithGroq(candidateName, cvText, userMessage, history = []) {
    const systemPrompt = `
        TÚ ERES "${candidateName}". NO eres una IA. Eres la persona descrita en este CV:
        ---
        ${cvText}
        ---
        Instrucciones:
        1. Responde en primera persona ("Yo hice...", "Mi experiencia...").
        2. Basa tus respuestas ESTRICTAMENTE en la información del CV.
        3. Si te preguntan algo que no está en el CV, di que no tienes experiencia en eso.
        4. Mantén un tono profesional pero conversacional.
        5. IMPORTANTE: Sé conciso. Tus respuestas no deben exceder los 2 o 3 párrafos.
    `;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6), // Solo los últimos 6 mensajes de historial
        { role: 'user', content: userMessage },
    ];

    const completion = await groqClient.chat.completions.create({
        messages,
        model: MODEL,
        temperature: 0.7,
        max_tokens: 1024,
    });

    return completion.choices[0].message.content;
}

/**
 * Analiza un CV en texto plano y retorna {role, score, skills, summary}.
 * Replica el prompt de get_ai_score() del backend Python.
 * Se llama desde el frontend después de que el backend extrae el texto del PDF.
 *
 * @param {string} cvText - Texto crudo del CV (extraído por el backend)
 * @returns {Promise<{role: string, score: number, skills: string[], summary: string}>}
 */
export async function analyzeCVWithGroq(cvText) {
    const text = cvText?.slice(0, 6000) ?? '';

    const systemPrompt = `
Eres un Principal Tech Recruiter y Staff Engineer.
Tu objetivo es auditar CVs técnicos de manera EXTREMADAMENTE ESTRICTA, OBJETIVA y PROFESIONAL.
Basa tu evaluación únicamente en evidencia comprobable (fechas, métricas, contexto técnico). No asumas competencias que no estén explícitamente respaldadas por logros.

TU ÚNICA SALIDA DEBE SER UN OBJETO JSON VÁLIDO. NO ESCRIBAS TEXTO ADICIONAL ANTES NI DESPUÉS.

ESTRUCTURA JSON REQUERIDA:
{
  "role": "Rol técnico exacto inferido (ej. 'Frontend Developer', 'No Técnico')",
  "score": 0,
  "skills": ["Habilidad comprobada 1", "Habilidad comprobada 2"],
  "summary": "Evaluación profesional y objetiva (máximo 3 líneas). Destaca fortalezas reales y brechas críticas (ej. falta de métricas, experiencia solo académica, etc)."
}

RÚBRICA DE PUNTUACIÓN (0 a 100) - REGLAS ESTRICTAS:
- [0 - 25 puntos] TRAINEE / BOOTCAMP: Sin experiencia laboral real en producción. Solo proyectos personales, cursos o certificados.
- [26 - 45 puntos] JUNIOR: 1-2 años de experiencia. Descripciones genéricas ("desarrollo de interfaces", "mantenimiento de base de datos"). Sin métricas de impacto.
- [46 - 70 puntos] SEMI-SENIOR: 2-4 años. Demuestra resolución de problemas, menciona herramientas específicas en contexto y asume propiedad de tareas.
- [71 - 85 puntos] SENIOR: 4+ años. Liderazgo técnico, diseño de arquitectura, optimización de rendimiento y métricas de negocio claras (ej. "redujo carga un 40%").
- [86 - 100 puntos] STAFF / PRINCIPAL: Impacto organizacional, escalabilidad masiva, creación de estándares transversales.

PENALIZACIONES AUTOMÁTICAS (Aplica rigurosamente):
- Keyword Stuffing (listar 20+ tecnologías sin contexto de uso): -15 puntos.
- Falta de fechas claras en las experiencias: -20 puntos.
- Perfil no tecnológico (ej. Atención al cliente, Chofer): Score máximo = 10.

INSTRUCCIÓN VITAL: Si el candidato tiene 1 año de experiencia y tareas básicas, SU SCORE NO DEBE SUPERAR LOS 35 PUNTOS. Sé riguroso.
`;

    const userPrompt = `
Analiza el siguiente CV con extrema rigurosidad y devuelve ÚNICAMENTE el JSON requerido.

CV DEL CANDIDATO:
"""
${text}
"""
`;

    const completion = await groqClient.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        model: MODEL,
        temperature: 0.1,
    });

    const raw = completion.choices[0].message.content;
    
    // Extracción robusta de JSON (ignora cualquier texto antes o después)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("El modelo de IA no devolvió un formato JSON válido.");
    }
    
    return JSON.parse(jsonMatch[0]);
}
