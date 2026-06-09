import React from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';

export const SidebarFooter = ({ isPremium, planConfig, userEmail, toggleTheme, currentTheme, handleLogoutClick }) => {
    return (
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
                        <div className={`relative size-10 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 shadow-lg
                            ${isPremium
                                ? 'bg-gradient-to-tr from-amber-300 via-orange-400 to-rose-500 text-white'
                                : 'bg-slate-800 text-slate-300 dark:bg-slate-100 dark:text-slate-600'
                            }`}
                        >
                            {userEmail.charAt(0).toUpperCase()}
                            <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 border-[2px] border-slate-900 dark:border-white rounded-full" />
                        </div>

                        <div className="flex-1 min-w-0 md:group-[.is-collapsed]/sidebar:hidden">
                            <p className="text-sm font-bold truncate text-white tracking-tight dark:text-slate-900">
                                {userEmail.split('@')[0]}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate font-medium dark:text-slate-500">
                                {userEmail}
                            </p>
                        </div>

                        <button aria-label="Interactive control" type="button"
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

                        <button aria-label="Interactive control" type="button"
                            onClick={handleLogoutClick}
                            className="text-xs font-medium text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 pl-2 dark:text-slate-400 dark:hover:text-red-500"
                        >
                            <LogOut size={12} /> Salir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
