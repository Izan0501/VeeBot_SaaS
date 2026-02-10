import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const PricingHeader = ({ itemVariants }) => (
    <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-200/50 dark:border-white/10 backdrop-blur-md">
            <Sparkles size={14} className="fill-current animate-pulse" /> Nivel Profesional
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
            Desata el poder de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 animate-gradient-x">
                VeeBot Agency
            </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Deja de jugar y empieza a reclutar con esteroides. Acceso ilimitado a la IA más potente del mercado.
        </motion.p>
    </div>
);

export default PricingHeader;