import React from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

// Per `rerender-no-inline-components` and security-review:
// company_name is injected as text content only — no dangerouslySetInnerHTML.
const DashboardHeader = ({ candidatesCount, onOpenClearModal, isPremium, onNavigate }) => {
    const { tenant } = useTenant();

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm transition-colors">
            <div>
                <h2 className="text-base font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                    Talent Hub
                </h2>
                <p className="text-[10px] font-semibold text-brand uppercase tracking-widest leading-none">
                    {tenant.company_name}
                </p>
            </div>

            <div className="flex items-center gap-3">
                {candidatesCount > 0 && (
                    <button
                        onClick={onOpenClearModal}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                        title="Vaciar tabla"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
                {!isPremium && (
                    <button
                        onClick={() => onNavigate('/upgrade')}
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand/10 text-brand border border-brand/20 hover:bg-brand hover:text-white transition-all group"
                    >
                        <Sparkles size={12} className="group-hover:text-white" />
                        <span>Mejorar Plan</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default DashboardHeader;