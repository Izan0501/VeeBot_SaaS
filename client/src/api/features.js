import { API_URL, getHeaders } from './config';

export const featuresAPI = {
    analyzeChat: async (query) => {
        const formData = new FormData();
        formData.append('query', query);

        // Usamos getHeaders(true) para indicar Multipart (sin Content-Type JSON)
        const res = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData
        });

        if (res.status === 401) throw new Error('Sesión expirada');

        if (!res.ok) throw new Error('Error en IA');
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        return data;
    },

    getDashboardHistory: async (candidate_id) => {
        const res = await fetch(`${API_URL}/chat/${candidate_id}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return await res.json();
    },

    clearDashboardChat: async () => {
        const res = await fetch(`${API_URL}/chat/dashboard`, { // Asegúrate que coincida con la ruta del backend
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!res.ok) throw new Error("Error al limpiar el chat");
        return await res.json();
    },

    sendEmail: async (candidateId, candidateEmail, newStatus, templateType) => {
        const payloadData = {
            candidate_id: candidateId,
            email: candidateEmail,
            status: newStatus,
            template_type: templateType
        };
        console.log("🚀 Payload a enviar al backend:", payloadData);
        
        const res = await fetch(`${API_URL}/email/send-candidate`, {
            method: 'POST',
            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadData)
        });

        if (!res.ok) throw new Error('Error enviando email');
        return true;
    },

    compareCandidates: async (candidateIdA, candidateIdB) => {
        const res = await fetch(`${API_URL}/analyze/compare`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                candidate_id_a: candidateIdA,
                candidate_id_b: candidateIdB
            })
        });

        const text = await res.text();
        let data = {};
        try {
            if (text) data = JSON.parse(text);
        } catch (e) {
            console.error("Respuesta de comparación inválida:", text);
            throw new Error("Respuesta inválida del servidor");
        }

        if (!res.ok) {
            throw new Error(data.detail || "Error en la API");
        }

        return data;
    },

    simulateChat: async (candidateId, message, history) => {
        const res = await fetch(`${API_URL}/simulate/chat`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                candidate_id: candidateId,
                message: message,
                history: history
            })
        });

        const text = await res.text();
        let data = {};
        try {
            if (text) data = JSON.parse(text);
        } catch (e) {
            console.error("Respuesta chat inválida:", text);
            throw new Error("Respuesta inválida del servidor");
        }

        if (!res.ok) {
            throw new Error(data.detail || "Error en el chat");
        }

        return data; // { response: "..." }
    },

    seedData: async () => {
        const res = await fetch(`${API_URL}/seed`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error generando datos');
        return res.json();
    },

};