import React from 'react';
import { m } from 'framer-motion';
import { BrainCircuit, Zap, Code2 } from 'lucide-react';

const EmptyState = () => (
    <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute size-[800px] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>

        <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/40 dark:bg-slate-900/40 p-12 rounded-[3rem] border border-white/50 dark:border-slate-700/50 text-center max-w-lg backdrop-blur-xl relative z-10 shadow-2xl"
        >
            <div className="size-28 bg-gradient-to-br from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-500/30 transform rotate-3">
                <BrainCircuit size={56} className="text-white dark:text-slate-900" />
            </div>

            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                Neural <span className=" text-indigo-600 dark:text-indigo-400">Simulations</span>
            </h2>

            <div className="space-y-4 text-left px-4">
                <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600"><Zap size={20} /></div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Entrevistas en tiempo real</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600"><Code2 size={20} /></div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Validación técnica profunda</p>
                </div>
            </div>

            <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest font-bold">
                Selecciona un perfil para comenzar
            </p>
        </m.div>
    </div>
);

export default EmptyState;