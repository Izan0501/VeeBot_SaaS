import React from 'react';
import { motion } from 'framer-motion';

const FormInput = ({ label, name, type = "text", placeholder, value, onChange, delay }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">{label}</label>
        <input
            required
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400 font-medium text-sm md:text-base shadow-sm"
        />
    </motion.div>
);

export default FormInput;