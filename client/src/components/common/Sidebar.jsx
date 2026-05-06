import React, { useEffect, useState, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Users, UploadCloud, BarChart3, Settings, LogOut,
    BrainCircuit, Menu, X, Sun, Moon, Crown, Zap, Sparkles,
    FileText, ShieldCheck, Bot, Swords, Mail, LifeBuoy, ChevronRight, ChevronLeft, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Tenant Context ───────────────────────────────────────────────────────────
// useTenant is a lightweight context read — does NOT cause extra re-renders
// because TenantContext.value is memoized with useMemo in TenantProvider.
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';

// ─── Syne font (display font used for the wordmark) ──────────────────────────
// Hoisted outside component per `rendering-hoist-jsx` — avoids recreating
// the <style> element on every render cycle.
const SyneFont = (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');`}</style>
);

// ─── TenantLogo ──────────────────────────────────────────────────────────────
// Isolated component so img error state is self-contained and doesn't
// cause the parent Sidebar to re-render (`rerender-no-inline-components`).
// SECURITY: src comes from our own DB (logo_url stored on our backend),
// so we treat it as a trusted URL. We do NOT use dangerouslySetInnerHTML.
// company_name is rendered as text content only — zero XSS surface.
const TenantLogo = memo(function TenantLogo({ logoUrl, companyName, size = 44 }) {
    const [imgError, setImgError] = useState(false);

    // Derive up to 2 initials from the company name.
    // Edge cases: empty string, single word, multi-word with punctuation.
    const initials = (() => {
        if (!companyName || !companyName.trim()) return '?';
        const words = companyName.trim().split(/\s+/).filter(Boolean);
        if (words.length === 1) return words[0][0].toUpperCase();
        // Two-word names: first letter of each of the first two words
        return (words[0][0] + words[1][0]).toUpperCase();
    })();

    const handleError = useCallback(() => setImgError(true), []);

    if (logoUrl && !imgError) {
        return (
            <img
                src={logoUrl}
                alt={`${companyName} logo`}
                onError={handleError}
                className="relative z-10 object-contain rounded-lg"
                style={{ width: size, height: size }}
                crossOrigin="anonymous"
            />
        );
    }

    // Fallback: initials avatar styled with the tenant brand color
    return (
        <div
            className="relative z-10 flex items-center justify-center rounded-xl font-black text-white select-none bg-brand"
            style={{ width: size, height: size, fontSize: size * 0.36 }}
            aria-label={companyName}
        >
            {initials}
        </div>
    );
});

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ onOpenModal, toggleTheme, currentTheme, userRole }) => {
    const location = useLocation();

    // ── Auth — canonical logout (cross-origin redirect via utils/domain.js) ──
    const { logout } = useAuth();

    // ── Tenant data (branding) ────────────────────────────────────────────────
    // Per `rerender-defer-reads`: we only subscribe to the fields we actually
    // use. But since useTenant returns a memo'd object, this is already safe.
    const { tenant } = useTenant();

    const [userEmail, setUserEmail]         = useState('Usuario');
    const [isMobileMenuOpen, setIsMobile]   = useState(false);
    const [isCollapsed, setIsCollapsed]     = useState(false);
    const [showLogoutModal, setShowLogout]  = useState(false);

    // Role helpers
    const isPremium = userRole === 'Premium' || userRole === 'Admin' || userRole === 'Reclutador';

    const planConfig = isPremium ? {
        label:     'PRO MEMBER',
        textStyle: 'text-amber-300 dark:text-amber-600',
        bgStyle:   'bg-brand/10 border-brand/30 dark:bg-indigo-50 dark:border-indigo-100',
        icon:      <Crown size={12} className="text-amber-400 fill-amber-400" />,
        glow:      'shadow-brand-sm',
    } : {
        label:     'STARTER PLAN',
        textStyle: 'text-slate-400 dark:text-slate-500',
        bgStyle:   'bg-slate-800/50 border-slate-700 dark:bg-slate-100 dark:border-slate-200',
        icon:      <Zap size={12} className="text-slate-400 dark:text-slate-500" />,
        glow:      '',
    };

    const isActive = useCallback(
        (path) => location.pathname === path,
        [location.pathname],
    );

    // Decode JWT once on mount to get user email
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.sub) setUserEmail(payload.sub);
        } catch (e) {
            console.error('Token decode error:', e);
        }
    }, []);

    // Close mobile menu on navigation
    useEffect(() => { setIsMobile(false); }, [location.pathname]);

    const handleLogoutClick = useCallback(() => setShowLogout(true), []);
    const cancelLogout      = useCallback(() => setShowLogout(false), []);
    // Per `rerender-move-effect-to-event`: logout is a direct user action,
    // not a side effect. Delegates to AuthContext.logout() which calls
    // logoutAndRedirect() (utils/domain.js) for cross-origin hard redirect.
    const confirmLogout     = useCallback(() => logout(), [logout]);

    return (
        <>
            {/* ── Logout confirmation modal ─────────────────────────────── */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={cancelLogout}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
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
                                        onClick={cancelLogout}
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

            {/* ── Mobile header bar ─────────────────────────────────────── */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobile(true)}
                        className="p-2 -ml-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        {/* Mobile: tenant logo (25px) with fallback initials */}
                        <TenantLogo logoUrl={tenant.logo_url} companyName={tenant.company_name} size={28} />
                        <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                            {tenant.company_name}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Mobile backdrop ───────────────────────────────────────── */}
            <div
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobile(false)}
            />

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside className={`group/sidebar
                fixed md:sticky top-0 left-0 h-screen flex flex-col z-50
                transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'} md:translate-x-0 md:flex
                ${isCollapsed ? 'md:w-[88px] is-collapsed' : 'md:w-72'}
                bg-brand-surface text-white border-r border-brand-border
                dark:bg-white dark:text-slate-800 dark:border-slate-200
            `}>

                {/* ── Sidebar header ────────────────────────────────────── */}
                <div className="p-6 h-24 flex justify-between items-center relative transition-all duration-300">
                    {SyneFont}

                    {/* Ambient glow — uses brand color via Tailwind shadow token */}
                    <div className="absolute top-0 left-10 w-32 h-32 bg-brand/10 blur-[50px] rounded-full pointer-events-none dark:hidden group-[.is-collapsed]/sidebar:hidden" />

                    {/* ── Logo + Wordmark ───────────────────────────────── */}
                    <div className="flex items-center gap-3 min-w-0">

                        {/* Animated logo container */}
                        <motion.div
                            className="relative flex-shrink-0 cursor-default"
                            style={{ width: 44, height: 44 }}
                            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.05 }}
                            whileHover="hover"
                        >
                            {/* Pulsing ambient ring — brand secondary color */}
                            <motion.div
                                className="absolute pointer-events-none"
                                style={{
                                    inset: '-10px',
                                    background: 'radial-gradient(ellipse at 50% 60%, color-mix(in srgb, var(--color-primary) 40%, transparent) 0%, color-mix(in srgb, var(--color-secondary) 20%, transparent) 45%, transparent 72%)',
                                    filter: 'blur(10px)',
                                }}
                                animate={{ opacity: [0.4, 0.85, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            {/* Spinning conic border */}
                            <motion.div
                                className="absolute pointer-events-none"
                                style={{
                                    inset: '-8px',
                                    borderRadius: '50%',
                                    border: '1px solid transparent',
                                    background: 'conic-gradient(from 0deg, transparent 55%, color-mix(in srgb, var(--color-secondary) 70%, white) 75%, transparent 100%) border-box',
                                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'destination-out',
                                    maskComposite: 'exclude',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Tenant logo with initials fallback */}
                            <TenantLogo
                                logoUrl={tenant.logo_url}
                                companyName={tenant.company_name}
                                size={44}
                            />
                        </motion.div>

                        {/* Wordmark — visible when sidebar is expanded */}
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    className="overflow-hidden whitespace-nowrap flex-shrink-0"
                                    initial={{ opacity: 0, x: -10, width: 0 }}
                                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                                    exit={{ opacity: 0, x: -10, width: 0 }}
                                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    <div className="leading-none">
                                        {/* Company name — rendered as text, never innerHTML (XSS-safe) */}
                                        <span className="block text-[1.2rem] font-black tracking-tight text-white dark:text-slate-900 leading-snug truncate max-w-[140px]"
                                            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
                                        >
                                            {tenant.company_name}
                                        </span>
                                        <span className="block text-[0.58rem] font-bold uppercase tracking-[0.22em] text-brand-secondary/60 leading-tight mt-0.5"
                                            style={{ fontFamily: "'Syne', sans-serif" }}
                                        >
                                            AI Recruiter
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Collapse toggle (desktop) */}
                    <button
                        onClick={() => setIsCollapsed((c) => !c)}
                        className={`hidden md:flex absolute -right-3 top-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand rounded-full p-1 shadow-md z-50 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                    >
                        <ChevronLeft size={14} />
                    </button>

                    <button onClick={() => setIsMobile(false)} className="md:hidden text-slate-400 hover:text-white transition-colors p-1">
                        <X size={22} />
                    </button>
                </div>

                {/* ── Nav ──────────────────────────────────────────────── */}
                <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar py-2">

                    <div>
                        <p className="px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 group-[.is-collapsed]/sidebar:hidden">Dashboard</p>
                        <div className="space-y-1">
                            <NavItem to="/import"    icon={<UploadCloud size={20} />} text="Importar CVs"    active={isActive('/import')} />
                            <NavItem to="/dashboard" icon={<Users size={20} />}       text="Candidatos"      active={isActive('/dashboard')} />
                            <NavItem to="/export"    icon={<Download size={20} />}    text="Exportar Datos"  active={isActive('/export')} />
                            <NavItem to="/analytics" icon={<BarChart3 size={20} />}   text="Analíticas"      active={isActive('/analytics')} />
                        </div>
                    </div>

                    <div>
                        <p className="px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 group-[.is-collapsed]/sidebar:hidden">Herramientas</p>
                        <div className="space-y-1">
                            <NavItem to="/digital-twin" icon={<Bot size={20} />}      text="Digital Twin AI" active={isActive('/digital-twin')} />
                            <NavItem to="/comparator"   icon={<Swords size={20} />}   text="Comparar CVs"    active={isActive('/comparator')} />
                            <NavItem to="/emails"       icon={<Mail size={20} />}      text="Plantillas Email" active={isActive('/emails')} />
                            <NavItem to="/settings"     icon={<Settings size={20} />}  text="Configuración"   active={isActive('/settings')} />
                        </div>
                    </div>

                    {/* Upgrade CTA — only for non-premium users */}
                    {userRole !== 'Premium' && userRole !== 'Agency' && (
                        <div>
                            <p className="px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 group-[.is-collapsed]/sidebar:hidden">Premium</p>
                            <div className="space-y-1">
                                <Link to="/upgrade">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative w-full rounded-xl p-[1px] overflow-hidden cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand-secondary to-pink-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand-secondary to-pink-500 opacity-0 blur-md group-hover:opacity-30 transition-opacity duration-500" />
                                        <div className="relative h-full bg-white dark:bg-slate-950 rounded-[11px] px-3 py-2.5 flex items-center gap-2.5 transition-colors group-hover:bg-slate-50 dark:group-hover:bg-slate-900">
                                            <div className="shrink-0 w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center border border-brand/20 group-hover:border-brand/40 transition-colors">
                                                <Sparkles size={16} className="text-brand group-hover:text-brand-secondary transition-colors duration-300 animate-pulse" />
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0 justify-center group-[.is-collapsed]/sidebar:hidden">
                                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary leading-tight">
                                                    Upgrade
                                                </span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-brand dark:group-hover:text-brand-secondary transition-colors leading-tight">
                                                    Ser Premium
                                                </span>
                                            </div>
                                            <div className="text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all duration-300 group-[.is-collapsed]/sidebar:hidden">
                                                <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 group-[.is-collapsed]/sidebar:hidden">Soporte</p>
                        <div className="space-y-1">
                            <NavItem to="/dashboard/faq"     icon={<LifeBuoy size={20} />} text="Centro de Ayuda"    active={isActive('/dashboard/faq')} />
                            <NavItem to="/dashboard/contact" icon={<Mail size={20} />}      text="Contactar Soporte"  active={isActive('/dashboard/contact')} />
                        </div>
                    </div>
                </nav>

                {/* ── User profile footer ───────────────────────────────── */}
                <div className="p-4 mt-auto relative">
                    <div className={`relative rounded-2xl p-4 transition-all duration-300 border backdrop-blur-xl group
                        ${isPremium
                            ? 'bg-gradient-to-b from-slate-900 to-brand/20 border-brand/20 hover:border-brand/40 dark:from-white dark:to-slate-50 dark:border-brand/10'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 dark:bg-white dark:border-slate-200 dark:hover:border-slate-300'
                        }`}
                    >
                        {isPremium && (
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-brand-secondary rounded-2xl opacity-10 group-hover:opacity-20 transition duration-500 blur dark:opacity-0" />
                        )}

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:group-[.is-collapsed]/sidebar:flex-col items-center gap-3 mb-3">
                                {/* User avatar — initial from email */}
                                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 shadow-lg
                                    ${isPremium
                                        ? 'bg-gradient-to-tr from-amber-300 via-orange-400 to-rose-500 text-white'
                                        : 'bg-slate-800 text-slate-300 dark:bg-slate-100 dark:text-slate-600'
                                    }`}
                                >
                                    {userEmail.charAt(0).toUpperCase()}
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-[2px] border-slate-900 dark:border-white rounded-full" />
                                </div>

                                <div className="flex-1 min-w-0 md:group-[.is-collapsed]/sidebar:hidden">
                                    <p className="text-sm font-bold truncate text-white tracking-tight dark:text-slate-900">
                                        {userEmail.split('@')[0]}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate font-medium dark:text-slate-500">
                                        {userEmail}
                                    </p>
                                </div>

                                <button
                                    onClick={toggleTheme}
                                    className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors dark:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-200 dark:hover:text-brand md:group-[.is-collapsed]/sidebar:hidden"
                                    title="Cambiar Tema"
                                >
                                    {currentTheme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-2 pt-3 border-t border-white/5 dark:border-slate-100 md:group-[.is-collapsed]/sidebar:hidden">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${planConfig.bgStyle} ${planConfig.glow}`}>
                                    {planConfig.icon}
                                    <span className={`text-[10px] font-bold tracking-wider uppercase ${planConfig.textStyle}`}>
                                        {planConfig.label}
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogoutClick}
                                    className="text-xs font-medium text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 pl-2 dark:text-slate-400 dark:hover:text-red-500"
                                >
                                    <LogOut size={12} /> Salir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

// ─── NavItem ─────────────────────────────────────────────────────────────────
// Extracted outside Sidebar per `rerender-no-inline-components`.
// Active state uses bg-brand (→ var(--color-primary)) instead of hardcoded indigo-600.
const NavItem = memo(function NavItem({ to, icon, text, active }) {
    return (
        <Link
            to={to}
            title={text}
            className={`flex items-center group-[.is-collapsed]/sidebar:justify-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                ${active
                    ? 'text-white shadow-brand-sm dark:text-white'
                    : 'text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-800'
                }`}
        >
            {/* Active / hover background */}
            <div className={`absolute inset-0 transition-opacity duration-300 rounded-xl
                ${active
                    ? 'opacity-100 bg-brand'
                    : 'opacity-0 bg-slate-800/50 group-hover:opacity-100 dark:bg-slate-100'
                }`}
            />

            {/* Icon */}
            <span className={`relative z-10 transition-colors duration-200
                ${active
                    ? 'text-white'
                    : 'text-slate-500 group-hover:text-white/80 dark:text-slate-400 dark:group-hover:text-slate-700'
                }`}
            >
                {icon}
            </span>

            {/* Label */}
            <span className="relative z-10 overflow-hidden whitespace-nowrap group-[.is-collapsed]/sidebar:w-0 group-[.is-collapsed]/sidebar:opacity-0 transition-all duration-300 transform origin-left">
                {text}
            </span>

            {/* Active indicator dot */}
            {active && (
                <div className="absolute right-3 group-[.is-collapsed]/sidebar:right-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
            )}
        </Link>
    );
});

export default Sidebar;