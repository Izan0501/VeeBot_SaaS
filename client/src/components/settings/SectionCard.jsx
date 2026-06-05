import React from 'react';
import { m } from 'framer-motion';

const SectionCard = ({ title, icon, children, headerColor = "bg-slate-800" }) => (
  <m.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none transition-colors overflow-hidden"
  >
    <div className="p-8 pb-0">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 ${headerColor} rounded-2xl shadow-lg shadow-${headerColor.replace('bg-', '')}/30`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
    </div>
    <div className="p-8 pt-0">{children}</div>
  </m.div>
);

export default SectionCard;