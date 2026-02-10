import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const PrivacyHeader = () => (
    <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="mb-12 text-center"
    >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase mb-6 tracking-widest border border-emerald-200 dark:border-emerald-800">
            <Shield size={14} /> Datos protegidos
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
            Política de Privacidad
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Tu privacidad es nuestra prioridad. Te explicamos claramente qué hacemos (y qué no hacemos) con tu información.
        </p>
    </motion.div>
);

export default PrivacyHeader;