// Definimos la URL base una sola vez
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ─── Cookie reader (inline, no import, to avoid circular deps) ────────────────
// Per `js-cache-storage`: reads cookie once per call and caches nothing — this
// function is only called when making API requests, not in hot render paths.
function _getTokenFromCookie() {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
}

// Helper para generar headers automáticamente.
// Priority: localStorage (same-origin fast path) → cookie (cross-domain fallback).
// The cookie fallback is critical on the FIRST render after a cross-subdomain
// navigation: AuthContext.useEffect may not have back-filled localStorage yet,
// but an API call (e.g. verifyToken → getMe) is already in-flight.
export const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('token') || _getTokenFromCookie();
    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};