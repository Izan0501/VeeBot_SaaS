import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Componentes
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadModal from './components/UploadModal';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("Free");
  const [isLoading, setIsLoading] = useState(true);

  // --- LÓGICA DARK MODE ---
  // 1. Inicializar estado leyendo localStorage o preferencia del sistema
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return localStorage.getItem('theme') || 'dark';
    }
    return localStorage.getItem('theme') || 'light';
  });

  // 2. Aplicar clase 'dark' al HTML cuando cambia el estado
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 3. Función para alternar
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  // ------------------------

  // Lógica de Auth Original
  useEffect(() => {
    const checkAuth = async () => { // <--- Hacemos esto async
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        // FETCH AL PERFIL PARA SACAR EL ROL REAL
        try {
          const res = await fetch('http://127.0.0.1:8000/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUserRole(data.role); // Guardamos "Premium" o "Free"
          }
        } catch (e) {
          console.error("Error fetching role", e);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Componente para proteger rutas PREMIUM
  const PremiumRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Si no es Premium ni Admin, lo mandamos al dashboard con una alerta (o a settings para pagar)
    if (userRole !== 'Premium' && userRole !== 'Admin' && userRole !== 'Reclutador') {
      // Opción A: Redirigir a Settings para que pague
      return <Navigate to="/settings" replace />;
    }
    return children;
  };

  // Layout Protegido (Ahora pasa props de tema al Sidebar)
  const ProtectedLayout = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Sidebar
          onOpenModal={() => setIsModalOpen(true)}
          toggleTheme={toggleTheme}
          currentTheme={theme}
          userRole={userRole} // <--- Pasamos el rol al Sidebar
        />
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {children}
        </main>
        <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Cargando VeeBot...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white dark:border-slate-700',
        style: { border: '1px solid #E2E8F0', padding: '16px', borderRadius: '10px' },
        success: { iconTheme: { primary: '#4F46E5', secondary: '#FFFAEE' } }
      }} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={() => window.location.reload()} />} /> {/* Reload para forzar fetch de rol */}
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Rutas Privadas */}
        <Route path="/dashboard" element={
          <ProtectedLayout>
            {/* Pasamos el userRole al Dashboard para bloquear el Chat */}
            <Dashboard isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userRole={userRole} />
          </ProtectedLayout>
        } />

        {/* RUTA ANALYTICS: SOLO PREMIUM */}
        <Route path="/analytics" element={
          <ProtectedLayout>
            {/* Si intentan entrar aquí siendo Free, los rebota */}
            {userRole === 'Premium' || userRole === 'Admin' || userRole === 'Reclutador'
              ? <Analytics />
              : <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md">
                  <span className="text-4xl">🔒</span>
                  <h2 className="text-2xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">Función Premium</h2>
                  <p className="text-slate-500 mb-6">El panel de analíticas avanzadas está reservado para miembros Pro.</p>
                  <a href="/settings" className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Mejorar Plan ($29)</a>
                </div>
              </div>
            }
          </ProtectedLayout>
        } />

        <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;