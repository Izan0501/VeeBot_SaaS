import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, FileUp } from 'lucide-react';

const FileList = ({ files, onRemove, isUploading }) => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            <AnimatePresence>
                {files.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-slate-400 text-center"
                    >
                        <FileUp size={40} className="mb-3 opacity-20" />
                        <p className="text-sm">Lista vacía.<br />Agrega archivos para comenzar.</p>
                    </motion.div>
                )}
                {files.map((file, idx) => (
                    <motion.div
                        key={`${file.name}-${idx}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-lg shrink-0">
                                <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate w-32 md:w-40">{file.name}</p>
                                <p className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(idx)}
                            className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                            disabled={isUploading}
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FileList;