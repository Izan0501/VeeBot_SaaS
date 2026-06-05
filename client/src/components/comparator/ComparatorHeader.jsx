import React from 'react';
import { m } from 'framer-motion';
import { Swords } from 'lucide-react';

const ComparatorHeader = () => (
    <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
            <Swords size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Comparador <span className=" text-indigo-600 dark:text-indigo-400">Versus AI</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            ¿Indeciso? Deja que la Inteligencia Artificial analice fortalezas y debilidades frente a frente para darte un veredicto objetivo.
        </p>
    </m.div>
);

export default ComparatorHeader;