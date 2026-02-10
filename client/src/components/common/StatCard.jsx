import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, trend, icon, color }) => (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2.5 rounded-xl ${color} shadow-lg shadow-indigo-500/20`}>{icon}</div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50">
                <ArrowUpRight size={10} className="text-green-600 dark:text-green-400" />
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">{trend}</span>
            </div>
        </div>
        <div>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{title}</p>
        </div>
    </div>
);

export default StatCard;