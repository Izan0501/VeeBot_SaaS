/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React from 'react';
import { m } from 'framer-motion';

const FormInput = ({ label, name, type = "text", placeholder, value, onChange, delay, id }) => (
    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="space-y-2">
        <label htmlFor={id || name || "input"} className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">{label}</label>
        <input
            required
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400 font-medium text-sm md:text-base shadow-sm"
        />
    </m.div>
);

export default FormInput;