import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/auth'; // <--- NEW IMPORT

const AuthContext = createContext();

/**
 * Custom hook to easily access auth state
 */
export const useAuth = () => useContext(AuthContext);

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
            const isPremiumRole = ['Premium', 'Admin', 'Reclutador', 'Agency'].includes(userData.role);

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
     * Check for an existing token on mount
     */
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
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
     */
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};