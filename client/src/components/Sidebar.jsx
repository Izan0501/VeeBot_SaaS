import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Users, UploadCloud, BarChart3, Settings, LogOut,
    BrainCircuit, Menu, X, Sun, Moon, Crown, Zap, Sparkles,
    FileText, ShieldCheck, Bot, Swords, Mail, LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onOpenModal, toggleTheme, currentTheme, userRole }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("Usuario");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estado para el modal de Logout
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Helpers de Rol
    const isPremium = userRole === 'Premium' || userRole === 'Admin' || userRole === 'Reclutador';

    // Configuración visual del Plan
    const planConfig = isPremium ? {
        label: "PRO MEMBER",
        textStyle: "text-amber-300 dark:text-amber-600",
        bgStyle: "bg-indigo-950/50 border-indigo-500/30 dark:bg-indigo-50 dark:border-indigo-100",
        icon: <Crown size={12} className="text-amber-400 fill-amber-400" />,
        glow: "shadow-[0_0_15px_rgba(99,102,241,0.3)] dark:shadow-none"
    } : {
        label: "STARTER PLAN",
        textStyle: "text-slate-400 dark:text-slate-500",
        bgStyle: "bg-slate-800/50 border-slate-700 dark:bg-slate-100 dark:border-slate-200",
        icon: <Zap size={12} className="text-slate-400 dark:text-slate-500" />,
        glow: ""
    };

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

    // 1. Abre el modal
    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    // 2. Ejecuta la salida
    const confirmLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            {/* --- MODAL DE CONFIRMACIÓN DE LOGOUT --- */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowLogoutModal(false)} // Cerrar al hacer click afuera
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()} // Evitar cierre al hacer click adentro
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full relative overflow-hidden"
                        >
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500">
                                    <LogOut size={24} className="ml-1" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¿Cerrar Sesión?</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                    Tendrás que volver a ingresar tus credenciales para acceder al dashboard.
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmLogout}
                                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-200/50 dark:shadow-none transition-colors"
                                    >
                                        Sí, salir
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER MÓVIL */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1 rounded text-white"><BrainCircuit size={18} /></div>
                        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">VeeBot</span>
                    </div>
                </div>
            </div>

            {/* BACKDROP MOBILE */}
            <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />

            {/* --- SIDEBAR --- */}
            <aside className={`
                fixed md:sticky top-0 left-0 h-screen w-72 flex flex-col z-50
                transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex
                
                bg-slate-950 text-white border-r border-slate-800
                dark:bg-white dark:text-slate-800 dark:border-slate-200
            `}>

                {/* Header Sidebar */}
                <div className="p-6 h-24 flex justify-between items-center relative">
                    <div className="absolute top-0 left-10 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none dark:hidden"></div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 dark:ring-black/5">
                            <BrainCircuit size={26} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight leading-none text-white dark:text-slate-900">VeeBot AI</h1>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase opacity-70">Recruiter OS</span>
                        </div>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors p-1"><X size={22} /></button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar py-2">

                    {/* SECCIÓN 1: DASHBOARD */}
                    <div>
                        <p className="px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Dashboard</p>
                        <div className="space-y-1">
                            <NavItem
                                to="/import"
                                icon={<UploadCloud size={20} />}
                                text="Importar CVs"
                                active={location.pathname === '/import'}
                            />
                            <NavItem to="/dashboard" icon={<Users size={20} />} text="Candidatos" active={isActive('/dashboard')} />
                            <NavItem to="/analytics" icon={<BarChart3 size={20} />} text="Analíticas" active={isActive('/analytics')} />
                        </div>
                    </div>

                    {/* SECCIÓN 2: HERRAMIENTAS */}
                    <div>
                        <p className="px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Herramientas</p>
                        <div className="space-y-1">
                            <NavItem
                                to="/digital-twin"
                                icon={<Bot size={20} />}
                                text="Digital Twin AI"
                                active={isActive('/digital-twin')}
                            />
                            <NavItem to="/comparator" icon={<Swords size={20} />} text="Comparar CVs" active={isActive('/comparator')} />
                            <NavItem to="/emails" icon={<Mail size={20} />} text="Plantillas Email" active={isActive('/emails')} />
                            <NavItem to="/settings" icon={<Settings size={20} />} text="Configuración" active={location.pathname === '/settings'} />
                        </div>
                    </div>

                    {/* SECCIÓN 3: LEGAL & SOPORTE */}
                    <div>
                        <p className="px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Soporte</p>
                        <div className="space-y-1">

                            {/* FAQ - Ruta Interna */}
                            <NavItem
                                to="/dashboard/faq"
                                icon={<LifeBuoy size={20} />}
                                text="Centro de Ayuda"
                                active={isActive('/dashboard/faq')}
                            />

                            {/* CONTACTO - Ruta Interna */}
                            <NavItem
                                to="/dashboard/contact"
                                icon={<Mail size={20} />}
                                text="Contactar Soporte"
                                active={isActive('/dashboard/contact')}
                            />

                            {/* TÉRMINOS - Ruta Interna */}
                            <NavItem
                                to="/dashboard/terms"
                                icon={<FileText size={20} />}
                                text="Términos"
                                active={isActive('/dashboard/terms')}
                            />

                            {/* PRIVACIDAD - Ruta Interna */}
                            <NavItem
                                to="/dashboard/privacy"
                                icon={<ShieldCheck size={20} />}
                                text="Privacidad"
                                active={isActive('/dashboard/privacy')}
                            />
                        </div>
                    </div>

                </nav>

                {/* --- FOOTER USER PROFILE --- */}
                <div className="p-4 mt-auto relative">

                    <div className={`relative rounded-2xl p-4 transition-all duration-300 border backdrop-blur-xl group
                        ${isPremium
                            ? 'bg-gradient-to-b from-slate-900 to-indigo-950/40 border-indigo-500/20 hover:border-indigo-500/40 dark:from-white dark:to-slate-50 dark:border-indigo-100'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 dark:bg-white dark:border-slate-200 dark:hover:border-slate-300'
                        }`}
                    >
                        {isPremium && <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-10 group-hover:opacity-20 transition duration-500 blur dark:opacity-0"></div>}

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 shadow-lg
                                    ${isPremium
                                        ? "bg-gradient-to-tr from-amber-300 via-orange-400 to-rose-500 text-white"
                                        : "bg-slate-800 text-slate-300 dark:bg-slate-100 dark:text-slate-600"
                                    }`}
                                >
                                    {userEmail.charAt(0).toUpperCase()}
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-[2px] border-slate-900 dark:border-white rounded-full"></span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate text-white tracking-tight dark:text-slate-900">
                                        {userEmail.split('@')[0]}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate font-medium dark:text-slate-500">
                                        {userEmail}
                                    </p>
                                </div>

                                <button
                                    onClick={toggleTheme}
                                    className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors dark:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-200 dark:hover:text-indigo-600"
                                    title="Cambiar Tema"
                                >
                                    {currentTheme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-2 pt-3 border-t border-white/5 dark:border-slate-100">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${planConfig.bgStyle} ${planConfig.border} ${planConfig.glow}`}>
                                    {planConfig.icon}
                                    <span className={`text-[10px] font-bold tracking-wider uppercase ${planConfig.textStyle}`}>
                                        {planConfig.label}
                                    </span>
                                </div>

                                {/* BOTÓN DE LOGOUT ACTUALIZADO */}
                                <button
                                    onClick={handleLogoutClick}
                                    className="text-xs font-medium text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 pl-2 dark:text-slate-400 dark:hover:text-red-500"
                                >
                                    <LogOut size={12} /> Salir
                                </button>
                            </div>

                            {!isPremium && (
                                <Link
                                    to="/settings"
                                    className="mt-3 flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg transition-all shadow-lg shadow-indigo-900/30 group-hover:scale-[1.02]"
                                >
                                    <Sparkles size={12} className="fill-white" /> Mejorar a Pro
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

// NavItem Personalizado
const NavItem = ({ to, icon, text, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
        ${active
            ? 'text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] dark:text-white dark:shadow-indigo-500/20'
            : 'text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-indigo-700'
        }`}
    >
        <div className={`absolute inset-0 transition-opacity duration-300 
            ${active
                ? 'opacity-100 bg-indigo-600'
                : 'opacity-0 bg-slate-800/50 group-hover:opacity-100 dark:bg-indigo-50'
            }`}>
        </div>

        <span className={`relative z-10 transition-colors duration-200 
            ${active
                ? 'text-white'
                : 'text-slate-500 group-hover:text-indigo-300 dark:text-slate-400 dark:group-hover:text-indigo-600'
            }`}>
            {icon}
        </span>

        <span className="relative z-10">{text}</span>

        {active && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>}
    </Link>
);

export default Sidebar;