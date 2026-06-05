import React from 'react';
import { m } from 'framer-motion';
import { Check, X, Flame } from 'lucide-react';

const CheckIcon = () => <div className="size-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center"><Check size={14} className="text-green-600 dark:text-green-400" strokeWidth={3} /></div>;
const XIcon = () => <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><X size={14} className="text-slate-400" /></div>;

const TableRow = ({ feature, free, pro, highlight = false }) => (
    <div className={`grid grid-cols-3 p-5 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors items-center ${highlight ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
        <div className="col-span-1 font-medium text-slate-700 dark:text-slate-300 text-sm">{feature}</div>
        <div className="col-span-1 text-center text-slate-500 text-sm font-medium flex justify-center">{free}</div>
        <div className="col-span-1 text-center font-bold text-indigo-600 dark:text-indigo-400 text-sm flex justify-center">{pro}</div>
    </div>
);

const ComparisonTable = ({ itemVariants }) => (
    <m.div variants={itemVariants} className="max-w-5xl mx-auto mb-20">
        <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">¿Por qué actualizar?</h3>
            <p className="text-slate-500 dark:text-slate-400">La diferencia entre un aficionado y un profesional.</p>
        </div>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <div className="col-span-1 text-xs font-bold uppercase tracking-widest text-slate-400">Característica</div>
                <div className="col-span-1 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Plan Starter</div>
                <div className="col-span-1 text-center text-xs font-bold uppercase tracking-widest text-indigo-500">Plan Agency</div>
            </div>

            <TableRow feature="Límite de CVs Mensuales" free="5 CVs" pro="Ilimitado" highlight />
            <TableRow feature="Modelo de Inteligencia Artificial" free="Llama 3 Basic" pro="Llama 3.3 (70B) Turbo" />
            <TableRow feature="Chat con Gemelo Digital" free="4 mensajes/chat" pro="Conversación Ilimitada" />
            <TableRow feature="Exportación a Excel/CSV" free={<XIcon />} pro={<CheckIcon />} />
            <TableRow feature="Análisis Comparativo (Versus)" free={<XIcon />} pro={<CheckIcon />} />
            <TableRow feature="Soporte Técnico" free="Email (48hs)" pro="Prioritario (WhatsApp)" />
        </div>
    </m.div>
);

export default ComparisonTable;