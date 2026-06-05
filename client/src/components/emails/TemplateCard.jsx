/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React from 'react';
import { m } from 'framer-motion';

const TemplateCard = ({ title, icon, data, onChange }) => (
    <m.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
    >
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{icon}</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>

        <div className="space-y-4">
            <div>
                <label htmlFor={`subject-${title}`} className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Asunto</label><input id={`subject-${title}`}
                    type="text"
                    value={data?.subject || ""}
                    onChange={(e) => onChange('subject', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor={`body-${title}`} className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cuerpo del Mensaje</label><textarea id={`body-${title}`}
                    value={data?.body || ""}
                    onChange={(e) => onChange('body', e.target.value)}
                    rows={6}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                />
            </div>
        </div>
    </m.div>
);

export default TemplateCard;