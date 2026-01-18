import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// ... (componentes) ...
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop'; // <--- IMPORTANTE
import Dashboard from './pages/Dashboard';
import UploadModal from './components/UploadModal';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import ImportData from './pages/ImportData';
import EmailTemplates from './pages/EmailTemplates';
import Comparator from './pages/Comparator';
import Faq from './pages/Faq';
import PremiumLock from './components/PremiumLock';

// --- COMPONENTE MÁGICO: CONTROLADOR DE TEMAS ---
const ThemeController = ({ userTheme }) => {
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const path = location.pathname;

    // 1. ZONA PRIVADA
    if (path.startsWith('/dashboard') || path.startsWith('/settings') || path.startsWith('/analytics') || path.startsWith('/emails') || path.startsWith('/comparator') || path.startsWith('/import')) {
      if (userTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    }
    // 2. EXCEPCIÓN: FAQ
    else if (path === '/faq') {
      root.classList.remove('dark');
    }
    // 3. ZONA PÚBLICA
    else {
      root.classList.add('dark');
    }
  }, [location, userTheme]);

  return null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("Free");
  const [isLoading, setIsLoading] = useState(true);

  // Estado del tema
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return localStorage.getItem('theme') || 'dark';
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        try {
          const res = await fetch('http://127.0.0.1:8000/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            setUserRole(data.role);
          }
        } catch (e) { console.error(e); }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // --- LAYOUT PROTEGIDO CON SCROLL RESET ---
  const ProtectedLayout = ({ children }) => {
    const mainContentRef = useRef(null); // Referencia al contenedor principal
    const location = useLocation();      // Hook para detectar cambio de ruta

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Efecto para subir el scroll del dashboard al cambiar de página
    useEffect(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo(0, 0);
      }
    }, [location.pathname]);

    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Sidebar onOpenModal={() => setIsModalOpen(true)} toggleTheme={toggleTheme} currentTheme={theme} userRole={userRole} />

        {/* Agregamos la ref aquí para controlar el scroll interno */}
        <main ref={mainContentRef} className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
          {children}
        </main>

        <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  };

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <Router>
      {/* 1. SCROLL TO TOP GLOBAL (Para Landing y páginas públicas) */}
      <ScrollToTop />

      {/* 2. THEME CONTROLLER */}
      <ThemeController userTheme={theme} />

      <Toaster position="top-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white', style: { borderRadius: '10px' } }} />

      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={() => window.location.reload()} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/contact" element={<Contact isPublic={true} />} />
        <Route path="/terms" element={<Terms isPublic={true} />} />
        <Route path="/privacy" element={<Privacy isPublic={true} />} />
        <Route path="/faq" element={<Faq isPublic={true} />} />

        {/* Rutas Privadas */}
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userRole={userRole} /></ProtectedLayout>} />

        <Route path="/import" element={<ProtectedLayout><ImportData /></ProtectedLayout>} />

        <Route path="/analytics" element={<ProtectedLayout>{userRole === 'Premium' || userRole === 'Admin' || userRole === 'Reclutador' ? <Analytics /> : <PremiumLock icon="📊" title="Analíticas Avanzadas" description="Visualiza métricas clave..." />}</ProtectedLayout>} />

        <Route path="/emails" element={<ProtectedLayout>{userRole === 'Premium' || userRole === 'Admin' || userRole === 'Reclutador' ? <EmailTemplates /> : <PremiumLock icon="✉️" title="Email Automation" description="Contacta candidatos..." />}</ProtectedLayout>} />

        <Route path="/comparator" element={<ProtectedLayout>{userRole === 'Premium' || userRole === 'Admin' || userRole === 'Reclutador' ? <Comparator /> : <PremiumLock icon="⚔️" title="Versus AI" description="Comparación técnica..." />}</ProtectedLayout>} />

        {/* Rutas Internas de Soporte (Mapeadas al Sidebar) */}
        <Route path="/dashboard/faq" element={<ProtectedLayout><Faq isPublic={false} /></ProtectedLayout>} />
        <Route path="/dashboard/contact" element={<ProtectedLayout><Contact isPublic={false} /></ProtectedLayout>} />
        <Route path="/dashboard/terms" element={<ProtectedLayout><Terms isPublic={false} /></ProtectedLayout>} />
        <Route path="/dashboard/privacy" element={<ProtectedLayout><Privacy isPublic={false} /></ProtectedLayout>} />

        <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;