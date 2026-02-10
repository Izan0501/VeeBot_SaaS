import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Loader2, Trash2 } from 'lucide-react';

const ClearModal = ({ isOpen, onClose, onConfirm, isClearing, count }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/50 max-w-sm w-full relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-600 dark:text-red-500 mx-auto border-4 border-white dark:border-slate-800 shadow-xl">
                        <AlertOctagon size={28} />
                    </div>
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">¿Estás seguro?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Esta acción eliminará <strong>{count} candidatos</strong> de forma permanente. No podrás deshacerlo.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
                        <button onClick={onConfirm} disabled={isClearing} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2">
                            {isClearing ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                            {isClearing ? "Borrando..." : "Vaciar Todo"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default ClearModal;