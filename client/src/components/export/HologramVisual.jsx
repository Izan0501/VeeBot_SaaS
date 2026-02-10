import React from 'react';
import { motion } from 'framer-motion';
import { Server, FileSpreadsheet, FileText } from 'lucide-react';

const HologramVisual = () => (
    <div className="flex-1 w-full relative h-64 md:h-auto flex items-center justify-center">
        {/* Círculos Concéntricos Animados */}
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-64 h-64 border border-emerald-500/20 rounded-full"
            ></motion.div>
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.2, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="w-48 h-48 border border-cyan-500/30 rounded-full absolute"
            ></motion.div>
        </div>

        {/* Icono Central Server */}
        <div className="relative z-10 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-4 rounded-2xl text-white shadow-lg">
                <Server size={48} />
            </div>
            {/* Partículas flotantes */}
            <motion.div
                animate={{ y: -20, opacity: 0 }}
                initial={{ y: 0, opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute -top-4 right-4 text-emerald-500"
            >
                <FileSpreadsheet size={16} />
            </motion.div>
            <motion.div
                animate={{ y: -30, opacity: 0 }}
                initial={{ y: 0, opacity: 1 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="absolute -top-2 left-2 text-cyan-500"
            >
                <FileText size={14} />
            </motion.div>
        </div>
    </div>
);

export default HologramVisual;