import React from 'react';
import { m } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const UploadStatus = ({ isUploading, progress, hasFiles, onUpload }) => {
    return (
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            {isUploading ? (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span>Procesando con IA…</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <m.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            ) : (
                <button aria-label="Interactive control" type="button"
                    onClick={onUpload}
                    disabled={!hasFiles}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
                    ${hasFiles
                            ? 'bg-slate-900 hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-50 hover:scale-[1.02] active:scale-95'
                            : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'}`}
                >
                    <Sparkles size={18} /> Iniciar Análisis
                </button>
            )}
        </div>
    );
};

export default UploadStatus;