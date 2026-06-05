import React from 'react';

const ReadOnlyField = ({ label, value, icon, id, name }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id || name || "input"} className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
    <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center justify-between cursor-default">
      {value}
      <span className="text-slate-300 dark:text-slate-600">{icon}</span>
    </div>
  </div>
);

export default ReadOnlyField;