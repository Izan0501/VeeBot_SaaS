import React, { useRef } from 'react';
import { m } from 'framer-motion';
import { UploadCloud, CheckCircle, Cpu, ShieldCheck } from 'lucide-react';

const DragDropZone = ({ dragActive, onDrag, onDrop, onFileSelect }) => {
    const inputRef = useRef(null);

    return (
        <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
        >
            <div
                className={`relative h-[500px] rounded-[30px] border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center p-10 overflow-hidden group
                ${dragActive
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
            >
                {/* Fondo decorativo */}
                <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/[0.2] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] pointer-events-none" />

                <input
                    ref={inputRef}
                    type="file"
                    aria-label="Upload PDF files"
                    multiple
                    accept=".pdf"
                    className="hidden"
                    onChange={onFileSelect}
                />

                <div className="relative z-10 space-y-6">
                    <m.div
                        animate={{ y: dragActive ? -10 : 0 }}
                        className={`size-24 mx-auto rounded-3xl flex items-center justify-center shadow-2xl transition-colors duration-300 
                        ${dragActive ? 'bg-indigo-500 text-white' : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'}`}
                    >
                        <UploadCloud size={48} />
                    </m.div>

                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Arrastra y suelta tus PDFs
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            o <button aria-label="Interactive control" type="button" onClick={() => inputRef.current.click()} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">explora tus archivos</button> localmente
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> PDF Soportado</span>
                        <span className="flex items-center gap-1"><Cpu size={12} className="text-purple-500" /> OCR Auto</span>
                        <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-blue-500" /> Secure</span>
                    </div>
                </div>
            </div>
        </m.div>
    );
};

export default DragDropZone;