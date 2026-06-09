import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Users, UploadCloud, BarChart3, Settings, Bot, Swords, Mail, LifeBuoy, ChevronRight, Download, Sparkles } from 'lucide-react';

const NavItem = ({ to, icon, text, active }) => {
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
            <div className={`absolute inset-0 transition-opacity duration-300 rounded-xl
                ${active
                    ? 'opacity-100 bg-brand'
                    : 'opacity-0 bg-slate-800/50 group-hover:opacity-100 dark:bg-slate-100'
                }`}
            />
            <span className={`relative z-10 transition-colors duration-200
                ${active
                    ? 'text-white'
                    : 'text-slate-500 group-hover:text-white/80 dark:text-slate-400 dark:group-hover:text-slate-700'
                }`}
            >
                {icon}
            </span>
            <span className="relative z-10 overflow-hidden whitespace-nowrap group-[.is-collapsed]/sidebar:w-0 group-[.is-collapsed]/sidebar:opacity-0 transition-all duration-300 transform origin-left">
                {text}
            </span>
            {active && (
                <div className="absolute right-3 group-[.is-collapsed]/sidebar:right-1 size-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
            )}
        </Link>
    );
};

export const SidebarNav = ({ isActive, userRole }) => {
    return (
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

            {userRole !== 'Premium' && userRole !== 'Agency' && (
                <div>
                    <p className="px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 group-[.is-collapsed]/sidebar:hidden">Premium</p>
                    <div className="space-y-1">
                        <Link to="/upgrade">
                            <m.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative w-full rounded-xl p-[1px] overflow-hidden cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand-secondary to-pink-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy" />
                                <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand-secondary to-pink-500 opacity-0 blur-md group-hover:opacity-30 transition-opacity duration-500" />
                                <div className="relative h-full bg-white dark:bg-slate-950 rounded-[11px] px-3 py-2.5 flex items-center gap-2.5 transition-colors group-hover:bg-slate-50 dark:group-hover:bg-slate-900">
                                    <div className="shrink-0 size-8 rounded-lg bg-brand/10 flex items-center justify-center border border-brand/20 group-hover:border-brand/40 transition-colors">
                                        <Sparkles size={16} className="text-brand group-hover:text-brand-secondary transition-colors duration-300 animate-pulse" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0 justify-center group-[.is-collapsed]/sidebar:hidden">
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest from-brand to-brand-secondary leading-tight text-indigo-600 dark:text-indigo-400">
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
                            </m.div>
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
    );
};
