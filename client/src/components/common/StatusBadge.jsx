import React from 'react';

const StatusBadge = ({ status }) => {
    let styles = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    if (status && status.includes('Alto')) styles = 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50';
    else if (status && status.includes('Medio')) styles = 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50';
    else if (status && status.includes('Rechazado')) styles = 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50';

    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles}`}>{status || "Pendiente"}</span>;
};

export default StatusBadge;