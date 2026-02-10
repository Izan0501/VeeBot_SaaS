import React from 'react';
import { motion } from 'framer-motion';
import { Database, Eye } from 'lucide-react';

const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const PrivacyCards = () => (
    <motion.div
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
    >
        <motion.div variants={cardVariant} whileHover={{ y: -5 }} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-blue-500 transition-colors group">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Database size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">No entrenamos con tus datos</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Los CVs que subes NO se utilizan para entrenar nuestros modelos de IA. Son 100% privados.</p>
        </motion.div>

        <motion.div variants={cardVariant} whileHover={{ y: -5 }} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-purple-500 transition-colors group">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <Eye size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Acceso Restringido</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Solo tú tienes acceso a los candidatos. Ni siquiera nuestro equipo técnico accede sin permiso.</p>
        </motion.div>
    </motion.div>
);

export default PrivacyCards;