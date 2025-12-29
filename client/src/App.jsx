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
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) setIsAuthenticated(true);
      else setIsAuthenticated(false);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Layout Protegido (Ahora pasa props de tema al Sidebar)
  const ProtectedLayout = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">

        {/* Pasamos la función toggleTheme al Sidebar */}
        <Sidebar
          onOpenModal={() => setIsModalOpen(true)}
          toggleTheme={toggleTheme}
          currentTheme={theme}
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
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Rutas Privadas */}
        <Route path="/dashboard" element={<ProtectedLayout><Dashboard isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /></ProtectedLayout>} />
        <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;