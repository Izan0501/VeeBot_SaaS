import React from 'react';
import { m } from 'framer-motion';

const TermsHeader = () => (
    <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="mb-16 text-center">
        <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest text-xs uppercase mb-3 block">Última actualización: Enero 2026</span>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">Términos de Servicio</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Por favor lee estos términos cuidadosamente antes de usar nuestra plataforma de reclutamiento IA.
        </p>
    </m.div>
);

export default TermsHeader;