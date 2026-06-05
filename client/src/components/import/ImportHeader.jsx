import React from 'react';
import { m } from 'framer-motion';
import { Database } from 'lucide-react';

const ImportHeader = () => (
    <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
    >
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
            <Database size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Centro de <span className=" text-indigo-600 dark:text-indigo-400">Ingesta de Datos</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Arrastra tus lotes de CVs aquí. Nuestro motor IA procesará, analizará y clasificará cada perfil automáticamente.
        </p>
    </m.div>
);

export default ImportHeader;