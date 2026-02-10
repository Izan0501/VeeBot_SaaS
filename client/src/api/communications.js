import { API_URL, getHeaders } from './config';

export const communicationsAPI = {
    getTemplates: async () => {
        const res = await fetch(`${API_URL}/settings/templates`, {
            method: 'GET',
            headers: getHeaders()
        });

        // Lógica robusta anti-crash
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error('Error al cargar plantillas');
        return data; // Retorna { rejection: {...}, interview: {...} }
    },

    saveTemplates: async (templates) => {
        const res = await fetch(`${API_URL}/settings/templates`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ templates })
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error(data.detail || 'Error al guardar plantillas');
        return data;
    }
};