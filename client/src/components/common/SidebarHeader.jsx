import React from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { TenantLogo } from './TenantLogo';

const SyneFont = (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');`}</style>
);

export const SidebarHeader = ({ tenant, isCollapsed, setIsCollapsed, setIsMobile }) => {
    return (
        <div className="p-6 h-24 flex justify-between items-center relative transition-all duration-300">
            {SyneFont}

            <div className="absolute top-0 left-10 size-32 bg-brand/10 blur-[50px] rounded-full pointer-events-none dark:hidden group-[.is-collapsed]/sidebar:hidden" />

            <div className="flex items-center gap-3 min-w-0">
                <m.div
                    className="relative flex-shrink-0 cursor-default"
                    style={{ width: 44, height: 44 }}
                    initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.05 }}
                    whileHover="hover"
                >
                    <m.div
                        className="absolute pointer-events-none"
                        style={{
                            inset: '-10px',
                            background: 'radial-gradient(ellipse at 50% 60%, color-mix(in srgb, var(--color-primary) 40%, transparent) 0%, color-mix(in srgb, var(--color-secondary) 20%, transparent) 45%, transparent 72%)',
                            filter: 'blur(10px)',
                        }}
                        animate={{ opacity: [0.4, 0.85, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <m.div
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
                    <TenantLogo
                        logoUrl={tenant.logo_url}
                        companyName={tenant.company_name}
                        size={44}
                    />
                </m.div>

                <AnimatePresence>
                    {!isCollapsed && (
                        <m.div
                            className="overflow-hidden whitespace-nowrap flex-shrink-0"
                            initial={{ opacity: 0, x: -10, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                            exit={{ opacity: 0, x: -10, width: 0 }}
                            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <div className="leading-none">
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
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            <button aria-label="Interactive control" type="button"
                onClick={() => setIsCollapsed((c) => !c)}
                className={`hidden md:flex absolute -right-3 top-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand rounded-full p-1 shadow-md z-50 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            >
                <ChevronLeft size={14} />
            </button>

            <button aria-label="Interactive control" type="button" onClick={() => setIsMobile(false)} className="md:hidden text-slate-400 hover:text-white transition-colors p-1">
                <X size={22} />
            </button>
        </div>
    );
};
