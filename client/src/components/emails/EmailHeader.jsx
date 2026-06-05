import React from 'react';
import { m } from 'framer-motion';
import { Save } from 'lucide-react';

const EmailHeader = ({ onSave }) => (
    <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Editor de Emails</h1>
            <p className="text-slate-500 dark:text-slate-400">Automatiza tu comunicación manteniendo un toque personal.</p>
        </div>
        <button aria-label="Interactive control" type="button" onClick={onSave} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
            <Save size={18} /> Guardar Cambios
        </button>
    </m.div>
);

export default EmailHeader;