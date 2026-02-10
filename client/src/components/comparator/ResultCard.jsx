import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ResultCard = ({ isWinner, name, points }) => (
    <motion.div
        className={`rounded-3xl p-8 border-2 relative overflow-hidden transition-all duration-500
        ${isWinner
                ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02] z-10'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100 grayscale-[0.5] hover:grayscale-0'
            }`}
    >
        {isWinner && (
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                MEJOR OPCIÓN
            </div>
        )}

        <h3 className={`text-2xl font-black mb-6 ${isWinner ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            {name}
        </h3>

        <ul className="space-y-4">
            {points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full ${isWinner ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                        {isWinner ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    </div>
                    <span className={`text-sm font-medium ${isWinner ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'}`}>
                        {point}
                    </span>
                </li>
            ))}
        </ul>
    </motion.div>
);

export default ResultCard;