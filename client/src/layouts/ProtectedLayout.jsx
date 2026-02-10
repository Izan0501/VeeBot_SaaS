import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// --- IMPORTS DE COMPONENTES ---
import Sidebar from '../components/common/Sidebar';
import UploadModal from '../components/import/UploadModal';

// --- IMPORTS DE CONTEXTO ---
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProtectedLayout = ({ children, isModalOpen, setIsModalOpen }) => {
  // 1. Consumimos los estados globales
  const { user, loading } = useAuth(); 
  const { isDarkMode, toggleTheme } = useTheme();
  
  // 2. Refs y Hooks para UX
  const mainContentRef = useRef(null);
  const location = useLocation();

  // 3. Efecto: Scroll to Top al cambiar de sección interna
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // 4. ESTADO DE CARGA (Evita parpadeos o redirecciones falsas)
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  // 5. BLOQUEO DE SEGURIDAD
  if (!user) {
    // Si terminó de cargar y no hay usuario, fuera.
    return <Navigate to="/login" replace />;
  }

  // 6. RENDERIZADO DEL LAYOUT
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* SIDEBAR: Recibe datos del contexto y funciones de control */}
      <Sidebar 
        onOpenModal={() => setIsModalOpen(true)} 
        toggleTheme={toggleTheme} 
        currentTheme={isDarkMode ? 'dark' : 'light'} 
        userRole={user.role} 
      />

      {/* MAIN CONTENT: Donde se renderizan las "pages" hijas */}
      <main 
        ref={mainContentRef} 
        className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative"
      >
        {children}
      </main>

      {/* MODAL GLOBAL: Disponible en toda la zona privada */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
    </div>
  );
};

export default ProtectedLayout;