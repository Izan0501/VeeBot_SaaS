import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; // <--- Conexión al contexto

const ThemeController = () => {
    // Obtenemos el estado y la función directamente del contexto
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            // Animaciones de entrada y hover
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}

            // Clases para que flote fijo en la esquina inferior derecha
            className="fixed bottom-6 right-6 z-[100] p-4 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-indigo-500/20 text-slate-600 dark:text-yellow-400 transition-colors"

            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            {/* Animación suave entre iconos */}
            <motion.div
                key={isDarkMode ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {isDarkMode ? <Sun size={24} className="animate-spin-slow" /> : <Moon size={24} />}
            </motion.div>
        </motion.button>
    );
};

export default ThemeController;