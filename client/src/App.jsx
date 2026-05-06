import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- IMPORTS DE CONTEXTO ---
import { useAuth } from './context/AuthContext';

// --- DOMAIN UTILS ---
import { getTenantOrigin } from './utils/domain';

// --- IMPORTS DE UTILS & COMMON ---
import ScrollToTop from './components/common/ScrollToTop';
import PremiumLock from './components/common/PremiumLock';

// --- IMPORTS DE LAYOUTS ---
import ProtectedLayout from './layouts/ProtectedLayout';
import LandingLayout from './layouts/LandingLayout';
import SimpleLayout from './layouts/SimpleLayout';

// --- IMPORTS PÁGINAS (Features & Core) ---
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DigitalTwin from './pages/DigitalTwin';
import ImportData from './pages/ImportData';
import EmailTemplates from './pages/EmailTemplates';
import Comparator from './pages/Comparator';
import DataExport from './pages/DataExport';
import Upgrade from './pages/Upgrade';

// --- IMPORTS PÁGINAS (Public & Auth) ---
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AuthHandoff from './pages/AuthHandoff';
import Onboarding from './pages/Onboarding';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Verificación segura de rol (Fallback a false si no hay user)
  const isPremium = ['Premium', 'Agency', 'Agency Pro'].includes(user?.role);

  return (
    <>
      <ScrollToTop />

      <Toaster
        position="top-center"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700',
          style: { borderRadius: '12px', padding: '16px' }
        }}
      />

      <Routes>

        {/* =================================================================
            1. ZONA PÚBLICA (LandingLayout -> Navbar + Footer)
           ================================================================= */}
        <Route path="/" element={
          <LandingLayout>
            <LandingPage />
          </LandingLayout>
        } />

        {/* =================================================================
            2. ZONA STANDALONE (SimpleLayout -> Lienzo Limpio)
           ================================================================= */}
        {/* /login: if user is already authenticated, send them to the right place.
            IMPORTANT: must redirect tenant users to their SUBDOMAIN, not root /dashboard.
            Sending a tenant user to root /dashboard causes the ghost-session loop:
              1. AuthContext reads cookie at root
              2. App.jsx sends to /dashboard (root)
              3. ProtectedLayout has no subdomain → shows default branding or re-redirects */}
        <Route path="/login" element={
          <LoginGate>
            <SimpleLayout><Login /></SimpleLayout>
          </LoginGate>
        } />

        {/* /register is deprecated — redirects to the OOBE Wizard */}
        <Route path="/register" element={<Navigate to="/onboarding" replace />} />

        {/* /auth/handoff — Token Handoff endpoint (cross-origin SSO).
            Receives the JWT as a URL param from root login/onboarding,
            writes it to subdomain localStorage, then redirects to /dashboard.
            Must be PUBLIC (no auth guard) since the user has no token yet
            at the moment this route is hit. */}
        <Route path="/auth/handoff" element={<AuthHandoff />} />

        <Route path="/onboarding" element={
          user ? <Navigate to="/dashboard" replace /> : (
            <Onboarding />
          )
        } />

        {/* Páginas Legales/Soporte (Versión Pública) */}
        <Route path="/contact" element={<SimpleLayout><Contact isPublic={true} /></SimpleLayout>} />
        <Route path="/faq" element={<SimpleLayout><Faq isPublic={true} /></SimpleLayout>} />
        <Route path="/terms" element={<SimpleLayout><Terms isPublic={true} /></SimpleLayout>} />
        <Route path="/privacy" element={<SimpleLayout><Privacy isPublic={true} /></SimpleLayout>} />

        {/* =================================================================
            3. ZONA PRIVADA (ProtectedLayout -> Auth Guard + Sidebar)
           ================================================================= */}

        {/* Core */}
        <Route path="/dashboard" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <Dashboard setIsModalOpen={setIsModalOpen} />
          </ProtectedLayout>
        } />

        {/* Features Gratuitas / Core */}
        <Route path="/digital-twin" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <DigitalTwin />
          </ProtectedLayout>
        } />

        <Route path="/import" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <ImportData />
          </ProtectedLayout>
        } />

        {/* ✅ AHORA ES GRATIS (Movido aquí y sin el check isPremium) */}
        <Route path="/export" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <DataExport />
          </ProtectedLayout>
        } />

        <Route path="/settings" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <Settings />
          </ProtectedLayout>
        } />

        <Route path="/upgrade" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <Upgrade />
          </ProtectedLayout>
        } />

        {/* Features Premium (Con Lock) */}
        <Route path="/analytics" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            {isPremium ? <Analytics /> : <PremiumLock icon="📊" title="Analíticas Avanzadas" description="Visualiza métricas clave de tu proceso de selección." />}
          </ProtectedLayout>
        } />

        <Route path="/emails" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            {isPremium ? <EmailTemplates /> : <PremiumLock icon="✉️" title="Email Automation" description="Contacta candidatos masivamente con un clic." />}
          </ProtectedLayout>
        } />

        <Route path="/comparator" element={
          <ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            {isPremium ? <Comparator /> : <PremiumLock icon="⚔️" title="Versus AI" description="Comparación técnica 1vs1 detallada." />}
          </ProtectedLayout>
        } />

        {/* Páginas Legales/Soporte (Versión Interna Dashboard - Sidebar visible) */}
        <Route path="/dashboard/faq" element={<ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}><Faq isPublic={false} /></ProtectedLayout>} />
        <Route path="/dashboard/contact" element={<ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}><Contact isPublic={false} /></ProtectedLayout>} />
        <Route path="/dashboard/terms" element={<ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}><Terms isPublic={false} /></ProtectedLayout>} />
        <Route path="/dashboard/privacy" element={<ProtectedLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}><Privacy isPublic={false} /></ProtectedLayout>} />

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;

// ─── LoginGate ────────────────────────────────────────────────────────────────
// Handles the authenticated redirect from /login correctly:
//   - User has tenant  → hard redirect to subdomain dashboard (cross-origin)
//   - User has no tenant → soft navigate to /dashboard (same-origin)
//   - No user          → render children (show the login form)
//
// This component is defined OUTSIDE App to satisfy `rerender-no-inline-components`
// and to prevent it from re-creating on every App render.
function LoginGate({ children }) {
  const { user, loading } = useAuth();

  // While AuthContext is resolving the token, render nothing to prevent flash
  if (loading) return null;

  if (user) {
    const subdomain = user?.tenant_config?.subdomain;
    if (subdomain) {
      // Cross-origin redirect — must be a hard navigation, not React Router
      // Use useEffect to avoid render-phase side effects (React strict mode safe)
      // Per `rendering-hydration-no-flicker`: immediate imperative redirect
      window.location.replace(`${getTenantOrigin(subdomain)}/dashboard`);
      // Return null while browser processes the redirect
      return null;
    }
    // No tenant (platform super-admin) — safe to stay at root
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}