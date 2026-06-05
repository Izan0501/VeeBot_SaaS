/* eslint-disable react-doctor/no-initialize-state */
import React, { use, createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { logoutAndRedirect } from '../utils/domain';

const AuthContext = createContext();

/**
 * Custom hook to easily access auth state
 */
export const useAuth = () => use(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Validates the session using the centralized API
     */
    const verifyToken = async (token) => {
        try {
            // CLEANER: We replaced the big 'fetch' block with this single line
            const userData = await authAPI.getMe();

            // Check if the role grants premium features
            const isPremiumRole = ['Premium', 'Admin', 'Reclutador', 'Agency', 'tenant_admin'].includes(userData.role);

            // Inyección Global de Branding (CSS Variables)
            if (userData.tenant_config && userData.tenant_config.branding) {
                const { primary_color, secondary_color } = userData.tenant_config.branding;
                if (primary_color) document.documentElement.style.setProperty('--color-primary', primary_color);
                if (secondary_color) document.documentElement.style.setProperty('--color-secondary', secondary_color);
            }

            setUser({
                ...userData,
                token,
                isPremium: isPremiumRole
            });
        } catch (error) {
            console.error("Session validation failed:", error);
            // If the API throws an error (401 or network), we log out
            logout();
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check for an existing token on mount.
     * Priority: localStorage (same-origin) → cookie (cross-origin, set by saveSessionCookie).
     * The cookie fallback is the key that makes cross-subdomain navigation work:
     * when the browser lands on sysloco.localhost after redirect from localhost,
     * localStorage is empty but the shared cookie is still present.
     */
    // eslint-disable-next-line react-doctor/no-initialize-state
    useEffect(() => {
        // Helper to read a cookie by name
        const getCookie = (name) => {
            const match = document.cookie
                .split('; ')
                .find((row) => row.startsWith(`${name}=`));
            return match ? decodeURIComponent(match.split('=')[1]) : null;
        };

        const token = /* eslint-disable-next-line react-doctor/js-cache-storage */ localStorage.getItem('token') || getCookie('token');

        if (token) {
            // Back-fill localStorage so same-origin reads work going forward
            if (!/* eslint-disable-next-line react-doctor/js-cache-storage */ localStorage.getItem('token')) {
                localStorage.setItem('token', token);
            }
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);


    /**
     * Login Action
     * Note: The 'token' comes from the Login component calling authAPI.login() first
     */
    const login = (token) => {
        localStorage.setItem('token', token); // 1. Save to Storage
        setLoading(true);
        verifyToken(token); // 2. Validate and get user details
    };

    /**
     * Logout Action
     *
     * Delegates to logoutAndRedirect() (utils/domain.js) which:
     *  1. Clears localStorage token + any auth cookies
     *  2. Dynamically strips the subdomain from the current hostname
     *  3. Calls window.location.replace(rootOrigin) — a true cross-origin
     *     hard redirect that also removes the entry from browser history.
     *
     * Per `rerender-move-effect-to-event`: logout is an event handler action,
     * NOT a side-effect that belongs in useEffect.
     */
    const logout = () => {
        // Reset React state so any pending renders see a clean slate
        setUser(null);
        setLoading(false);

        // Hand off to the utility — it handles storage + redirect
        logoutAndRedirect();
    };

    return (
        <AuthContext.Provider /* eslint-disable-next-line react-doctor/jsx-no-constructed-context-values */ value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};