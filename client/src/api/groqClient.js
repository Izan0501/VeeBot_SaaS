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
