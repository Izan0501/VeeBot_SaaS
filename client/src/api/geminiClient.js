/**
 * geminiClient.js
 * Native fetch client for Google Gemini 2.5 Flash.
 * Replaces groqClient.js — all prompt structures preserved.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL   = 'gemini-2.5-flash';
const BASE_URL       = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Core request helper.
 * Maps the legacy {systemPrompt, userPrompt} pattern to Gemini's REST body.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {Array}  history     - Optional multi-turn history [{role, content}]
 * @param {boolean} jsonMode   - Requests JSON MIME type from the model
 */
async function geminiRequest({ systemPrompt, userPrompt, history = [], jsonMode = false }) {
    // Build the `contents` array (multi-turn support)
    const contents = [];

    // Inject history (map OpenAI role "assistant" -> Gemini role "model")
    for (const msg of history) {
        contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        });
    }

    // Final user turn
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });

    const body = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
            temperature: 0.1,
            ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
        },
    };

    const MAX_RETRIES = 3;
    const RETRYABLE   = new Set([429, 503]);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Retryable transient errors — exponential backoff
        if (RETRYABLE.has(response.status) && attempt < MAX_RETRIES) {
            const waitMs = attempt * 1500;
            console.warn(`[geminiClient] ${response.status} received. Retrying in ${waitMs}ms… (attempt ${attempt}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, waitMs));
            continue;
        }

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(`Gemini API error ${response.status}: ${err?.error?.message ?? response.statusText}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }

    // All retries exhausted — throw a descriptive error
    throw new Error('Gemini API: máximo de reintentos alcanzado (503/429).');
}

// ─────────────────────────────────────────────────────────────
// 1. CV Analysis (replaces analyzeCVWithGroq)
// ─────────────────────────────────────────────────────────────

/**
 * Analyzes a raw CV text and returns {role, score, skills, summary}.
 * @param {string} cvText - Raw CV text (extracted by the backend)
 */
export async function analyzeCVWithGemini(cvText) {
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

    const raw = await geminiRequest({ systemPrompt, userPrompt, jsonMode: true });

    // Robust JSON extraction (handles any stray markdown fences)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('El modelo de IA no devolvió un formato JSON válido.');
    }
    return JSON.parse(jsonMatch[0]);
}

// ─────────────────────────────────────────────────────────────
// 2. Candidate Comparator (replaces compareWithGroq)
// ─────────────────────────────────────────────────────────────

/**
 * Compares two candidates and returns a structured JSON analysis.
 */
export async function compareWithGemini(candidateA, candidateB) {
    const systemPrompt = 'Eres un experto en Recursos Humanos Senior especializado en evaluación técnica objetiva. Respondes ÚNICAMENTE con JSON puro, sin markdown.';

    const userPrompt = `
Compara estos dos candidatos para un rol técnico genérico.

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

    const raw = await geminiRequest({ systemPrompt, userPrompt, jsonMode: true });
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini no devolvió JSON válido para la comparación.');
    return JSON.parse(jsonMatch[0]);
}

// ─────────────────────────────────────────────────────────────
// 3. Dashboard Chat (replaces dashboardChatWithGroq)
// ─────────────────────────────────────────────────────────────

/**
 * Dashboard-level chat — aware of all candidates.
 */
export async function dashboardChatWithGemini(query, candidatesList) {
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

    return geminiRequest({ systemPrompt, userPrompt: query, generationConfig: { temperature: 0.7 } });
}

// ─────────────────────────────────────────────────────────────
// 4. Digital Twin Chat (replaces digitalTwinChatWithGroq)
// ─────────────────────────────────────────────────────────────

/**
 * Simulates being the candidate using their full CV as a knowledge base.
 */
export async function digitalTwinChatWithGemini(candidateName, cvText, userMessage, history = []) {
    const systemPrompt = `
TÚ ERES "${candidateName}". NO eres una IA. Eres la persona descrita en este CV:
---
${cvText}
---
Instrucciones:
1. Responde en primera persona ("Yo hice…", "Mi experiencia…").
2. Basa tus respuestas ESTRICTAMENTE en la información del CV.
3. Si te preguntan algo que no está en el CV, di que no tienes experiencia en eso.
4. Mantén un tono profesional pero conversacional.
5. IMPORTANTE: Sé conciso. Tus respuestas no deben exceder los 2 o 3 párrafos.
`;

    return geminiRequest({
        systemPrompt,
        userPrompt: userMessage,
        history: history.slice(-6),
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    });
}
