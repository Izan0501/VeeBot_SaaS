import { API_URL, getHeaders } from './config';

export const authAPI = {
    // --- AUTENTICACIÓN PÚBLICA ---

    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // 1. Obtenemos texto plano primero para evitar errores si el body viene vacío
        const text = await res.text();

        // 2. Intentamos parsear solo si hay texto
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
            throw new Error(data.detail || "Email o contraseña incorrectos");
        }

        if (!data.access_token) {
            throw new Error("No se recibió el token de acceso");
        }

        return data; // Retorna { access_token: "..." }
    },

    register: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error(data.detail || 'Error al registrar cuenta');
        return data;
    },

    verifyEmail: async (email) => {
        const res = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error(data.detail || 'Email no encontrado');
        return data;
    },

    resetPasswordDirect: async (email, newPassword) => {
        const res = await fetch(`${API_URL}/auth/reset-password-direct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, new_password: newPassword })
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error(data.detail || 'Error al cambiar clave');
        return data;
    },

    // --- RUTAS PROTEGIDAS (Requieren Token) ---

    getMe: async () => {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: getHeaders()
        });

        // Usamos la misma lógica robusta aquí por seguridad
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error('Sesión inválida');
        return data;
    },

    updateProfile: async (data) => {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Error actualizando perfil');
        return res.json();
    },

    changePassword: async (currentPassword, newPassword) => {
        const res = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error(data.detail || 'Error cambiando contraseña');
        return data;
    },

    deleteAccount: async () => {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) throw new Error(data.detail || 'Error eliminando cuenta');
        return data;
    }
};