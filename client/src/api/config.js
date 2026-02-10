// Definimos la URL base una sola vez
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Helper para generar headers automáticamente
export const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    
    // Si no es subida de archivos (FormData), agregamos JSON
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    
    return headers;
};