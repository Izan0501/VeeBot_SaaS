import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const KPICard = ({ title, value, icon, color, delay, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 group hover:-translate-y-1 transition-transform duration-300"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${color} rounded-bl-3xl`}>
            {React.cloneElement(icon, { size: 32 })}
        </div>

        <div className="flex flex-col h-full justify-between">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight size={10} /> {trend}
                </span>
            </div>
        </div>
    </motion.div>
);

export default KPICard;