import React from 'react';
import { m } from 'framer-motion';
import { X } from 'lucide-react';

const ModalOverlay = ({ children, onClose }) => (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <m.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full relative">
            <button aria-label="Interactive control" type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
            {children}
        </m.div>
    </m.div>
);

export default ModalOverlay;