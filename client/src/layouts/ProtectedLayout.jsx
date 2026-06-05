import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// --- IMPORTS DE COMPONENTES ---
import Sidebar from '../components/common/Sidebar';

// --- IMPORTS DE CONTEXTO ---
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// --- DOMAIN UTILS ---
import { getTenantOrigin } from '../utils/domain';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper: detect whether we are currently on a tenant subdomain.
//
// If hostname is "lcsys.localhost" → subdomain is "lcsys" → isTenantDomain = true
// If hostname is "localhost"        → isTenantDomain = false
//
// Defined at module scope (outside component) per `rendering-hoist-jsx` and
// `rerender-no-inline-components` — this is a pure function with no closure deps.
// ─────────────────────────────────────────────────────────────────────────────
const PLATFORM_SUBDOMAINS = new Set(['www', 'app', 'admin', 'api', 'mail', 'veebot']);

function getCurrentSubdomain() {
    const parts = window.location.hostname.split('.');
    if (parts.length < 2) return null;
    const candidate = parts[0];
    if (candidate === 'localhost' || /^\d+$/.test(candidate)) return null;
    if (PLATFORM_SUBDOMAINS.has(candidate)) return null;
    return candidate;
}

// ─────────────────────────────────────────────────────────────────────────────
const ProtectedLayout = ({ children, isModalOpen, setIsModalOpen }) => {
    const { user, loading } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    const mainContentRef = useRef(null);
    const location = useLocation();

    // Scroll to top on internal route change
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo(0, 0);
        }
      // eslint-disable-next-line react-doctor/no-mutable-in-deps
  }, [location.pathname]);

    // ── 1. Loading state ──────────────────────────────────────────────────────
    // Per `rendering-hydration-no-flicker`: show a full-screen spinner while
    // AuthContext resolves the token. This prevents any flash of the login redirect.
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    // ── 2. Unauthenticated guard ──────────────────────────────────────────────
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ── 3. Subdomain mismatch guard (THE KEY FIX) ─────────────────────────────
    // Problem: after logout → login at root → cookie is read → AuthContext sets
    // user → App.jsx /login guard redirects to /dashboard at ROOT. The user now
    // sees the dashboard without branding because TenantProvider finds no subdomain.
    //
    // Solution: if the user has a tenant subdomain in their profile but we are
    // currently on the root domain, IMMEDIATELY redirect to the tenant URL.
    // This is an imperative hard redirect (not React Router) because crossing
    // localhost → sysloco.localhost is a cross-origin navigation.
    const tenantSubdomain = user?.tenant_config?.subdomain;
    const currentSubdomain = getCurrentSubdomain();

    if (tenantSubdomain && !currentSubdomain) {
        // We are authenticated with a tenant but sitting on the root domain.
        // Redirect to the correct tenant origin immediately.
        // Return null while the browser processes the navigation.
        window.location.replace(`${getTenantOrigin(tenantSubdomain)}${location.pathname}`);
        return null;
    }

    // ── 4. Render ─────────────────────────────────────────────────────────────
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">

            <Sidebar
                onOpenModal={() => setIsModalOpen(true)}
                toggleTheme={toggleTheme}
                currentTheme={isDarkMode ? 'dark' : 'light'}
                userRole={user.role}
            />

            <main
                ref={mainContentRef}
                className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative"
            >
                {children}
            </main>

        </div>
    );
};

export default ProtectedLayout;