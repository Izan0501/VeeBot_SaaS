import React, { memo, useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { Users, UploadCloud, BarChart3, Settings, Bot, Swords, Mail, LifeBuoy, ChevronRight, Download, Sparkles } from 'lucide-react';

const NavItem = ({ to, icon, text, active }) => {
    return (
        <Link
            to={to}
            title={text}
            className={`nav-item flex items-center group-[.is-collapsed]/sidebar:justify-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                ${active
                    ? 'nav-item-active shadow-[0_0_10px_color-mix(in_srgb,var(--color-accent)_10%,transparent)]'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-[#121216] hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] hover:text-[var(--color-primary)]'
                }`}
            style={active ? { 
                color: 'var(--color-accent)', 
                backgroundColor: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' 
            } : undefined}
        >
            <span className={`relative z-10 transition-colors duration-200
                ${active
                    ? ''
                    : 'text-zinc-400 dark:text-zinc-500 group-hover:text-[var(--color-primary)]'
                }`}
                style={active ? { color: 'var(--color-accent)' } : undefined}
            >
                {icon}
            </span>
            <span className="relative z-10 overflow-hidden whitespace-nowrap group-[.is-collapsed]/sidebar:w-0 group-[.is-collapsed]/sidebar:opacity-0 transition-all duration-300 transform origin-left">
                {text}
            </span>
        </Link>
    );
};

export const SidebarNav = ({ isActive, userRole }) => {
    const navRef = useRef(null);
    const location = useLocation();
    const [pillarStyle, setPillarStyle] = useState({ top: 0, height: 0, opacity: 0 });

    useEffect(() => {
        if (!navRef.current) return;
        const updatePillar = () => {
            const activeItem = navRef.current.querySelector('.nav-item-active');
            if (activeItem) {
                setPillarStyle({
                    top: activeItem.offsetTop,
                    height: activeItem.offsetHeight,
                    opacity: 1
                });
            } else {
                setPillarStyle(prev => ({ ...prev, opacity: 0 }));
            }
        };
        // Run immediately and after a short delay to ensure layout is complete
        updatePillar();
        const timeout = setTimeout(updatePillar, 50);
        
        window.addEventListener('resize', updatePillar);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', updatePillar);
        };
    }, [location]);

    return (
        <nav ref={navRef} className="relative flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar py-2">
            {/* Magnetic Pillar */}
            <div 
                className="absolute left-0 w-1 rounded-r-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) pointer-events-none z-20 group-[.is-collapsed]/sidebar:hidden"
                style={{ 
                    backgroundColor: 'var(--color-accent)',
                    boxShadow: '0 0 12px var(--color-accent)',
                    top: `${pillarStyle.top}px`,
                    height: `${pillarStyle.height}px`,
                    opacity: pillarStyle.opacity,
                    transform: 'translateY(0)'
                }}
            />
            <div>
                <p className="px-3 text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 group-[.is-collapsed]/sidebar:hidden">Dashboard</p>
                <div className="space-y-1">
                    <NavItem to="/import"    icon={<UploadCloud size={20} />} text="Importar CVs"    active={isActive('/import')} />
                    <NavItem to="/dashboard" icon={<Users size={20} />}       text="Candidatos"      active={isActive('/dashboard')} />
                    <NavItem to="/export"    icon={<Download size={20} />}    text="Exportar Datos"  active={isActive('/export')} />
                    <NavItem to="/analytics" icon={<BarChart3 size={20} />}   text="Analíticas"      active={isActive('/analytics')} />
                </div>
            </div>

            <div>
                <p className="px-3 text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 group-[.is-collapsed]/sidebar:hidden">Herramientas</p>
                <div className="space-y-1">
                    <NavItem to="/digital-twin" icon={<Bot size={20} />}      text="Digital Twin AI" active={isActive('/digital-twin')} />
                    <NavItem to="/comparator"   icon={<Swords size={20} />}   text="Comparar CVs"    active={isActive('/comparator')} />
                    <NavItem to="/emails"       icon={<Mail size={20} />}      text="Plantillas Email" active={isActive('/emails')} />
                    <NavItem to="/settings"     icon={<Settings size={20} />}  text="Configuración"   active={isActive('/settings')} />
                </div>
            </div>

            <div>
                <p className="px-3 text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 group-[.is-collapsed]/sidebar:hidden">Soporte</p>
                <div className="space-y-1">
                    <NavItem to="/dashboard/faq"     icon={<LifeBuoy size={20} />} text="Centro de Ayuda"    active={isActive('/dashboard/faq')} />
                    <NavItem to="/dashboard/contact" icon={<Mail size={20} />}      text="Contactar Soporte"  active={isActive('/dashboard/contact')} />
                </div>
            </div>
        </nav>
    );
};
