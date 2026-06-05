import React from 'react';
import { Lock } from 'lucide-react';

const InputGroup = ({ label, value, onChange, type = "text", disabled = false, icon, locked = false }) => {
    const generatedId = React.useId();
    return (
    <div className="flex flex-col gap-2">
        <label htmlFor={generatedId} className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                id={generatedId}
                className={`w-full px-4 py-3.5 rounded-xl border transition-all text-sm font-medium
                ${locked
                        ? 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 cursor-default'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                    }
            `}
            />
            {locked && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                </div>
            )}
        </div>
    </div>
);
};

export default InputGroup;