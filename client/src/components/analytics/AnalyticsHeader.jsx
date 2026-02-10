import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsHeader = ({ timeRange, setTimeRange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    Panel de Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">IA</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg">
                    Métricas en tiempo real sobre tu proceso de selección.
                </p>
            </div>

            <div className="flex gap-3">
                <div className="hidden md:flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {['7d', '30d', 'All'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            {range === 'All' ? 'Histórico' : range.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsHeader;