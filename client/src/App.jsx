import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- IMPORTS DE CONTEXTO ---
import { useAuth } from './context/AuthContext';

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
import Register from './pages/Register';
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
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : (
            <SimpleLayout>
              <Login />
            </SimpleLayout>
          )
        } />

        <Route path="/register" element={
          user ? <Navigate to="/dashboard" replace /> : (
            <SimpleLayout>
              <Register />
            </SimpleLayout>
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