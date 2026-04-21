import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';

const FaqHeader = ({ isPublic, searchTerm, setSearchTerm }) => (
    <div className="text-center mb-16 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-200/50 dark:border-white/10 backdrop-blur-md"
        >
            <Sparkles size={14} className="animate-pulse" /> Knowledge Base
        </motion.div>

        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-black mb-8 tracking-tighter leading-tight ${isPublic ? 'text-5xl md:text-7xl text-slate-900' : 'text-4xl md:text-6xl text-slate-900 dark:text-white'}`}
        >
            {isPublic ? (
                <>Descubre el <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">Poder Real</span><br />de VeeBot AI</>
            ) : (
                <>Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">Inteligencia</span></>
            )}
        </motion.h1>

        {/* SEARCH BAR */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto group"
        >
            {/* Glow trasero */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

            {/* Input Container */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center">
                <Search className="absolute left-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
                <input
                    type="text"
                    placeholder="Pregunta sobre capacidades, IA, exportación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // CORRECCIÓN AQUÍ: Eliminamos la condicional de isPublic para los colores de texto.
                    // Ahora siempre aplicará "text-slate-900" en light y "dark:text-white" en dark.
                    className="w-full py-5 pl-14 pr-6 bg-transparent outline-none text-lg font-medium transition-all rounded-2xl placeholder:text-slate-400 text-slate-900 dark:text-white"
                />
            </div>
        </motion.div>
    </div>
);

export default FaqHeader;