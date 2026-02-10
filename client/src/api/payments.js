import { API_URL, getHeaders } from './config';

export const paymentsAPI = {
    createCheckout: async () => {
        const res = await fetch(`${API_URL}/payments/create-checkout`, {
            method: 'POST',
            headers: getHeaders()
        });

        // 1. Leemos texto plano primero
        const text = await res.text();
        let data = {};

        // 2. Intentamos parsear
        try {
            if (text) data = JSON.parse(text);
        } catch (e) {
            console.error("Respuesta checkout inválida:", text);
            throw new Error("Respuesta inválida del servidor de pagos");
        }

        // 3. Verificamos errores del backend
        if (!res.ok) {
            throw new Error(data.detail || 'Error iniciando pago');
        }

        return data; // Retorna { checkout_url: "..." }
    },

    createPortal: async () => {
        const res = await fetch(`${API_URL}/payments/create-portal`, {
            method: 'POST',
            headers: getHeaders()
        });

        const text = await res.text();
        let data = {};

        try {
            if (text) data = JSON.parse(text);
        } catch (e) {
            console.error("Respuesta portal inválida:", text);
            throw new Error("Respuesta inválida del servidor de pagos");
        }

        if (!res.ok) {
            throw new Error(data.detail || 'Error accediendo al portal');
        }

        return data; 
    }
};