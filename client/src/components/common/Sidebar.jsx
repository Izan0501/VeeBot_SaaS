import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut, Menu, Crown, Zap } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { TenantLogo } from './TenantLogo';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';

const Sidebar = ({ onOpenModal, toggleTheme, currentTheme, userRole }) => {
    const routerLocation = useLocation();
    const { logout } = useAuth();
    const { tenant } = useTenant();

    const [userEmail, setUserEmail] = useState(() => {
        const token = localStorage.getItem('token');
        if (!token) return 'Usuario';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || 'Usuario';
        } catch (e) {
            return 'Usuario';
        }
    });
    const [isMobileMenuOpen, setIsMobile]   = useState(false);
    const [isCollapsed, setIsCollapsed]     = useState(false);
    const [showLogoutModal, setShowLogout]  = useState(false);

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
        (path) => routerLocation.pathname === path,
        [routerLocation.pathname],
    );

    useEffect(() => { setIsMobile(false); }, [routerLocation.pathname]);

    const handleLogoutClick = useCallback(() => setShowLogout(true), []);
    const cancelLogout      = useCallback(() => setShowLogout(false), []);
    const confirmLogout     = useCallback(() => logout(), [logout]);

    return (
        <>
            <AnimatePresence>
                {showLogoutModal && (
                    <m.div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') cancelLogout(); }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={cancelLogout}
                    >
                        <m.div
                            role="presentation"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 size-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="flex flex-col items-center text-center">
                                <div className="size-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500">
                                    <LogOut size={24} className="ml-1" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¿Cerrar Sesión?</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                    Tendrás que volver a ingresar tus credenciales para acceder al dashboard.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button aria-label="Interactive control" type="button"
                                        onClick={cancelLogout}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button aria-label="Interactive control" type="button"
                                        onClick={confirmLogout}
                                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-200/50 dark:shadow-none transition-colors"
                                    >
                                        Sí, salir
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>

            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <button aria-label="Interactive control" type="button"
                        onClick={() => setIsMobile(true)}
                        className="p-2 -ml-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <TenantLogo logoUrl={tenant.logo_url} companyName={tenant.company_name} size={28} />
                        <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                            {tenant.company_name}
                        </span>
                    </div>
                </div>
            </div>

            <button type="button"
                aria-label="Cerrar menú móvil"
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobile(false)}
            />

            <aside aria-label="Interactive control" className={`group/sidebar
                fixed md:sticky top-0 left-0 h-screen flex flex-col z-50
                transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'} md:translate-x-0 md:flex
                ${isCollapsed ? 'md:w-[88px] is-collapsed' : 'md:w-72'}
                bg-brand-surface text-white border-r border-brand-border
                dark:bg-white dark:text-slate-800 dark:border-slate-200
            `}>
                <SidebarHeader 
                    tenant={tenant}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    setIsMobile={setIsMobile}
                />

                <SidebarNav 
                    isActive={isActive}
                    userRole={userRole}
                />

                <SidebarFooter 
                    isPremium={isPremium}
                    planConfig={planConfig}
                    userEmail={userEmail}
                    toggleTheme={toggleTheme}
                    currentTheme={currentTheme}
                    handleLogoutClick={handleLogoutClick}
                />
            </aside>
        </>
    );
};

export default Sidebar;