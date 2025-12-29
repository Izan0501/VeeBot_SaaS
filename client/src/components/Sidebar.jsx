import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Users, UploadCloud, BarChart3, Settings, LogOut,
    BrainCircuit, UserCircle, Menu, X, Sun, Moon
} from 'lucide-react';

const Sidebar = ({ onOpenModal, toggleTheme, currentTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("Usuario");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.sub) setUserEmail(payload.sub);
            } catch (error) { console.error("Error token:", error); }
        }
    }, []);

    useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            {/* HEADER MÓVIL (Mantiene consistencia con el contenido, no invertido) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30 flex items-center justify-between px-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 opacity-90">
                        <BrainCircuit className="text-indigo-600 dark:text-indigo-400" size={20} />
                        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">VeeBot AI</span>
                    </div>
                </div>
                <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* BACKDROP */}
            <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />

            {/* --- SIDEBAR INVERTIDO --- */}
            <aside className={`
                fixed md:sticky top-0 left-0 h-screen w-64 flex flex-col z-50
                transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex
                
                /* MODO CLARO (Default): Fondo Oscuro */
                bg-slate-900 text-white border-r border-transparent

                /* MODO OSCURO (Dark): Fondo Claro (Invertido) */
                dark:bg-white dark:text-slate-800 dark:border-slate-200
            `}>

                {/* Header Sidebar */}
                <div className="p-6 h-16 flex justify-between items-center
                    border-b border-slate-800 dark:border-slate-100"
                >
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <BrainCircuit size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">VeeBot AI</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white dark:hover:text-slate-900 transition-colors p-1"><X size={22} /></button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <NavItem to="/dashboard" icon={<Users size={20} />} text="Candidatos" active={isActive('/dashboard')} />

                    {/* Botón Importar */}
                    <button
                        onClick={() => { onOpenModal(); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left
                        text-slate-400 hover:text-white hover:bg-slate-800
                        dark:text-slate-500 dark:hover:text-indigo-700 dark:hover:bg-indigo-50"
                    >
                        <UploadCloud size={20} /> Importar CVs
                    </button>

                    <NavItem to="/analytics" icon={<BarChart3 size={20} />} text="Analíticas" active={isActive('/analytics')} />
                    <NavItem to="/settings" icon={<Settings size={20} />} text="Configuración" active={isActive('/settings')} />
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 space-y-4 border-t border-slate-800 dark:border-slate-100">

                    {/* Botón Tema - Estilo Adaptativo Invertido */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-medium transition-colors border
                        bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700
                        dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-600 dark:border-slate-200"
                    >
                        <span>Modo: {currentTheme === 'dark' ? 'Oscuro' : 'Claro'}</span>
                        {currentTheme === 'dark' ? <Sun size={16} className="text-orange-500" /> : <Moon size={16} />}
                    </button>

                    <div className="flex items-center gap-3 p-2 rounded-lg transition-colors group
                        hover:bg-slate-800 dark:hover:bg-slate-100"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border
                            bg-indigo-500/20 text-indigo-400 border-indigo-500/30
                            dark:bg-indigo-100 dark:text-indigo-600 dark:border-indigo-200"
                        >
                            <UserCircle size={18} />
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate 
                                group-hover:text-white dark:text-slate-700 dark:group-hover:text-indigo-700 transition-colors"
                                title={userEmail}
                            >
                                {userEmail}
                            </p>
                            <p className="text-xs flex items-center gap-1
                                text-slate-500 dark:text-slate-400"
                            >
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="transition-colors p-1
                            text-slate-500 hover:text-red-400
                            dark:text-slate-400 dark:hover:text-red-600"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

// NavItem Invertido
const NavItem = ({ to, icon, text, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all 
        ${active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 dark:shadow-indigo-200'
            : 'text-slate-400 hover:text-white hover:bg-slate-800 dark:text-slate-500 dark:hover:text-indigo-700 dark:hover:bg-indigo-50'
        }`}
    >
        {icon}{text}
    </Link>
);

export default Sidebar;