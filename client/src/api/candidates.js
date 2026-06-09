import { API_URL, getHeaders } from './config';

export const candidatesAPI = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/candidates`, {
            method: 'GET',
            headers: getHeaders()
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : [];

        if (!res.ok) throw new Error('Error al obtener candidatos');
        return data;
    },

    getById: async (candidateId) => {
        const res = await fetch(`${API_URL}/candidates/${candidateId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) throw new Error('Error al obtener candidato');
        return data;
    },

    chatWithCandidate: async (candidateId, message) => {
        const formData = new FormData();
        formData.append('query', message);

        const res = await fetch(`${API_URL}/chat/${candidateId}`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData,
        });

        // Procesar la respuesta
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
            throw new Error(data.detail || 'Error al conectar con el Gemelo Digital');
        }

        return data;
    },

    getHistory: async (candidateId) => {
        const res = await fetch(`${API_URL}/chat/${candidateId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!res.ok) return []; // Si falla, devolvemos array vacío para no romper la UI
        return await res.json();
    },

    delete: async (id) => {
        const res = await fetch(`${API_URL}/candidates/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error al eliminar candidato');
        return true;
    },

    deleteAll: async () => {
        const res = await fetch(`${API_URL}/candidates`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error(data.detail || 'Error al vaciar tabla');
        return data;
    },

    // Acepta FormData directamente (ya construido en ImportData)
    upload: async (formData) => {
        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: getHeaders(true), // omite Content-Type para que el browser setee el boundary
            body: formData,
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
            throw new Error(data.detail || 'Error al subir archivos');
        }

        return data; // { status, message, candidates: [{id, name, text}], errors }
    },

    // Persiste el resultado del análisis IA del frontend
    saveAnalysis: async (candidateId, analysis) => {
        const res = await fetch(`${API_URL}/candidates/${candidateId}/analysis`, {
            method: 'PATCH',
            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(analysis),
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
            throw new Error(data.detail || 'Error al guardar análisis');
        }

        return data; // { id, status, score }
    },

    // Borra la memoria del Digital Twin para un candidato específico
    deleteTwinMemory: async (candidateId) => {
        const res = await fetch(`${API_URL}/twins/${candidateId}/memory`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) throw new Error(data.detail || 'Error al borrar la memoria del Digital Twin');
        return data;
    },

    // Carga la memoria del Digital Twin para un candidato específico
    getTwinMemory: async (candidateId) => {
        const res = await fetch(`${API_URL}/twins/${candidateId}/memory`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!res.ok) return { history: [], user_turn_count: 0 };
        return await res.json(); // { history: [{id, role, content}], user_turn_count: N }
    },

    // Persists a user+assistant turn to twins_chat after the browser Groq call
    saveTwinMemory: async (candidateId, userMessage, assistantMessage) => {
        const res = await fetch(`${API_URL}/twins/${candidateId}/memory/save`, {
            method: 'POST',
            headers: { ...getHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_message: userMessage, assistant_message: assistantMessage })
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) {
            const err = new Error(data.detail || 'Error saving twin memory');
            err.status = res.status;
            throw err;
        }
        return data; // { status: 'saved', user_turn_count: N }
    },
};