import React from 'react';
import { Database } from 'lucide-react';

const ExportHeader = () => (
    <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800">
            <Database size={12} /> Data Center
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Exportación de <span className=" text-emerald-600 dark:text-emerald-400">Talento</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Descarga tu base de conocimiento completa. Compatible con Excel, PowerBI y otros ATS.
        </p>
    </div>
);

export default ExportHeader;