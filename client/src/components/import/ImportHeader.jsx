import React from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

const ImportHeader = () => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
    >
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
            <Database size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Ingesta de Datos</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Arrastra tus lotes de CVs aquí. Nuestro motor IA procesará, analizará y clasificará cada perfil automáticamente.
        </p>
    </motion.div>
);

export default ImportHeader;