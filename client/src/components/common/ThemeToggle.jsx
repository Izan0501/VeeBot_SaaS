import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ toggleTheme, isDarkMode }) => {
  return (
    <motion.button
      onClick={toggleTheme}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-indigo-500/20 text-slate-600 dark:text-yellow-400 transition-all"
    >
      {isDarkMode ? <Sun size={24} className="animate-spin-slow" /> : <Moon size={24} className="text-slate-600" />}
    </motion.button>
  );
};

export default ThemeToggle;