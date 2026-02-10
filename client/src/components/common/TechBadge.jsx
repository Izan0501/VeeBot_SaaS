import React from 'react';

const TechBadge = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-2 group cursor-default">
    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-110 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-all">
      {React.cloneElement(icon, { className: "text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" })}
    </div>
    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{label}</span>
  </div>
);

export default TechBadge;