import React from 'react';
import { LogOut, Sun, Moon, Zap, ChevronRight } from 'lucide-react';

export const SidebarFooter = ({ isPremium, planConfig, userEmail, toggleTheme, currentTheme, handleLogoutClick }) => {
    return (
        <div className="p-4 mt-auto relative">
            {/* Scoped keyframes for shimmer animation */}
            <style>{`
                @keyframes shimmer-text {
                    0%   { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                .animate-shimmer-text {
                    animation: shimmer-text 4s linear infinite;
                }
            `}</style>

            {/* VIP Volumetric Glow — only renders for premium users */}
            {isPremium && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-amber-400/10 blur-2xl rounded-full dark:bg-amber-400/20" />
                </div>
            )}

            <div className={`relative rounded-2xl p-4 transition-all duration-300 backdrop-blur-2xl group ring-1 ring-slate-900/5
                ${isPremium
                    ? 'bg-white/40 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-amber-300/50 dark:bg-[#0a0a0a]/80 dark:border-amber-500/20 dark:hover:border-amber-400/40 dark:ring-0'
                    : 'bg-white/40 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-300/70 dark:bg-[#0a0a0a]/80 dark:border-white/5 dark:hover:border-white/10 dark:ring-0'
                }`}
            >
                {/* Premium ambient border glow */}
                {isPremium && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-2xl opacity-10 group-hover:opacity-25 transition-opacity duration-500 blur dark:opacity-15 dark:group-hover:opacity-30" />
                )}

                <div className="relative z-10">
                    {/* Avatar + User Metadata Row */}
                    <div className="flex flex-col md:flex-row md:group-[.is-collapsed]/sidebar:flex-col items-center gap-3 mb-3">
                        
                        {/* Avatar */}
                        <div className={`relative size-10 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0
                            ${isPremium
                                ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white shadow-[0_4px_14px_rgba(251,146,60,0.4)]'
                                : 'bg-white text-slate-700 shadow-sm border border-slate-200/60 ring-4 ring-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-transparent dark:ring-0 dark:shadow-lg'
                            }`}
                        >
                            {userEmail.charAt(0).toUpperCase()}

                            {/* Online dot with animate-ping aura */}
                            <span className="absolute -bottom-0.5 -right-0.5 flex size-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex size-3 rounded-full bg-emerald-500 border-[2px] border-white dark:border-[#0a0a0a]" />
                            </span>
                        </div>

                        {/* User Name + Email */}
                        <div className="flex-1 min-w-0 md:group-[.is-collapsed]/sidebar:hidden">
                            <p className="text-sm font-bold truncate text-slate-800 tracking-tight dark:text-slate-100">
                                {userEmail.split('@')[0]}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate font-medium dark:text-slate-500">
                                {userEmail}
                            </p>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            aria-label="Cambiar Tema"
                            onClick={toggleTheme}
                            className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-brand hover:border-brand/20 hover:bg-slate-50 transition-all duration-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-transparent dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-transparent md:group-[.is-collapsed]/sidebar:hidden"
                            title="Cambiar Tema"
                        >
                            {currentTheme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                        </button>
                    </div>

                    {/* Premium Upgrade Trigger (Definitive Edition) */}
                    {!isPremium && (
                        <div className="relative group/upgrade cursor-pointer md:group-[.is-collapsed]/sidebar:hidden w-full mb-3">
                            {/* Plasma Glow on Hover */}
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 rounded-xl opacity-0 group-hover/upgrade:opacity-40 blur-[3px] transition-all duration-500" />

                            {/* Main Card */}
                            <div className="relative flex items-center justify-between bg-gradient-to-tr from-white to-purple-50/50 dark:from-slate-900 dark:to-slate-800/90 backdrop-blur-md p-2.5 rounded-xl border border-purple-100 dark:border-purple-500/20 shadow-[0_2px_10px_rgb(0,0,0,0.02)] group-hover/upgrade:shadow-md transition-all duration-300">

                                <div className="flex items-center gap-3">
                                    {/* High-Contrast Icon Block */}
                                    <div className="size-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/30 group-hover/upgrade:scale-105 group-hover/upgrade:rotate-3 transition-transform duration-300">
                                        <Sun className="size-4.5 text-white drop-shadow-sm" />
                                    </div>

                                    {/* Typography */}
                                    <div className="flex flex-col justify-center">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 leading-tight mb-0.5">
                                            Upgrade
                                        </span>
                                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-tight group-hover/upgrade:text-purple-700 dark:group-hover/upgrade:text-white transition-colors">
                                            Ser Premium
                                        </span>
                                    </div>
                                </div>

                                {/* Action Chevron */}
                                <ChevronRight className="size-4 text-purple-300 dark:text-purple-600/50 group-hover/upgrade:translate-x-1 group-hover/upgrade:text-purple-600 dark:group-hover/upgrade:text-purple-400 transition-all duration-300 mr-1" />
                            </div>
                        </div>
                    )}

                    {/* Bottom Row — Plan Badge + Logout */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-white/5 md:group-[.is-collapsed]/sidebar:hidden">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${planConfig.bgStyle} ${planConfig.glow}`}>
                            {planConfig.icon}
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${planConfig.textStyle}`}>
                                {planConfig.label}
                            </span>
                        </div>

                        {/* High-Contrast Destructive Action */}
                        {/* eslint-disable-next-line react-doctor/no-gray-on-colored-background */}
                        <button 
                            type="button"
                            aria-label="Cerrar sesión"
                            onClick={handleLogoutClick}
                            className="group/logout flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-300
                                       text-slate-600 bg-white/60 border border-slate-200/60 shadow-sm
                                       hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow
                                       dark:text-slate-400 dark:bg-slate-800/50 dark:border-slate-700/50 
                                       dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30"
                        >
                            <LogOut className="size-3.5 transition-transform duration-300 group-hover/logout:-translate-x-0.5"/>
                            <span>Salir</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
