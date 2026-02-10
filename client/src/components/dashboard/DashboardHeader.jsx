import React from 'react';
import { Trash2, Sparkles, UploadCloud } from 'lucide-react';

const DashboardHeader = ({ candidatesCount, onOpenClearModal, isPremium, onNavigate, onOpenUploadModal }) => (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm transition-colors">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Dashboard de Talento</h2>
        <div className="flex items-center gap-3">
            {candidatesCount > 0 && (
                <button onClick={onOpenClearModal} className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30" title="Vaciar tabla">
                    <Trash2 size={18} />
                </button>
            )}
            {!isPremium && (
                <button onClick={() => onNavigate('/upgrade')} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all group">
                    <Sparkles size={12} className="text-yellow-500 group-hover:text-indigo-500" />
                    <span>Mejorar Plan</span>
                </button>
            )}
            <button onClick={onOpenUploadModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95">
                <UploadCloud size={18} />
                <span className="hidden md:inline">Subir CVs</span>
            </button>
        </div>
    </header>
);

export default DashboardHeader;