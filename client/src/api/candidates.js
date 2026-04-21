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

    upload: async (files) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: getHeaders(true),
            body: formData,
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
            throw new Error(data.detail || "Error al subir archivos");
        }

        return data;
    }
};