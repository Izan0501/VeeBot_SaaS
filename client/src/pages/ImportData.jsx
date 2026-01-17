import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud, FileText, CheckCircle, AlertCircle, X,
    Cpu, Database, Sparkles, FileUp, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const ImportData = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef(null);

    // --- MANEJO DE ARCHIVOS ---
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type === "application/pdf");
            if (newFiles.length !== e.dataTransfer.files.length) toast.error("Solo se permiten archivos PDF");
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const newFiles = Array.from(e.target.files).filter(file => file.type === "application/pdf");
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    };

    // --- LÓGICA DE SUBIDA (Misma API que el Modal) ---
    const handleUpload = async () => {
        if (files.length === 0) return;
        setIsUploading(true);
        setUploadProgress(10); // Inicio visual

        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        try {
            const token = localStorage.getItem('token');
            // Simulación de progreso
            const interval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 500);

            const res = await fetch('http://127.0.0.1:8000/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            clearInterval(interval);

            if (res.ok) {
                setUploadProgress(100);
                setTimeout(() => {
                    toast.success(`¡${files.length} CVs procesados con éxito!`);
                    setFiles([]);
                    setIsUploading(false);
                    setUploadProgress(0);
                }, 800);
            } else {
                throw new Error("Error en subida");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al subir archivos");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* HEADER ANIMADO */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
                        <Database size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Ingesta de Datos</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Arrastra tus lotes de CVs aquí. Nuestro motor IA procesará, analizará y clasificará cada perfil automáticamente.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- ZONA DE DROP (COLUMNA IZQUIERDA - GRANDE) --- */}
                    <motion.div
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
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {/* Fondo decorativo */}
                            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/[0.2] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] pointer-events-none" />

                            <input
                                ref={inputRef}
                                type="file"
                                multiple
                                accept=".pdf"
                                className="hidden"
                                onChange={handleChange}
                            />

                            <div className="relative z-10 space-y-6">
                                <motion.div
                                    animate={{ y: dragActive ? -10 : 0 }}
                                    className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-2xl transition-colors duration-300
                                    ${dragActive ? 'bg-indigo-500 text-white' : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'}`}
                                >
                                    <UploadCloud size={48} />
                                </motion.div>

                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                        Arrastra y suelta tus PDFs
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        o <button onClick={() => inputRef.current.click()} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">explora tus archivos</button> localmente
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> PDF Soportado</span>
                                    <span className="flex items-center gap-1"><Cpu size={12} className="text-purple-500" /> OCR Auto</span>
                                    <span className="flex items-center gap-1"><ShieldCheckIcon size={12} className="text-blue-500" /> Secure</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- PANEL LATERAL (LISTA DE ARCHIVOS Y ESTADO) --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col h-[500px]"
                    >
                        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[30px] border border-slate-200 dark:border-slate-800 shadow-xl p-6 flex flex-col overflow-hidden">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                                <span>Cola de Procesamiento</span>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg text-xs">
                                    {files.length} Archivos
                                </span>
                            </h3>

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
                                                onClick={() => removeFile(idx)}
                                                className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                                disabled={isUploading}
                                            >
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* FOOTER ACCIONES */}
                            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                                {isUploading ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                                            <span>Procesando con IA...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleUpload}
                                        disabled={files.length === 0}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
                                        ${files.length > 0
                                                ? 'bg-slate-900 hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-50 hover:scale-[1.02] active:scale-95'
                                                : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'}`}
                                    >
                                        <Sparkles size={18} /> Iniciar Análisis
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ShieldCheckIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default ImportData;