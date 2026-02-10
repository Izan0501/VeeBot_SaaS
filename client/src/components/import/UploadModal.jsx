import React, { useState } from 'react';
import { X, Upload, FileText, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { candidatesAPI } from '../../api/candidates'; 

const UploadModal = ({ isOpen, onClose }) => {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // No renderizar si está cerrado
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        // Filtramos solo PDFs
        const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');

        if (pdfFiles.length !== selectedFiles.length) {
            toast.error("Solo se permiten archivos PDF");
        }

        setFiles(prev => [...prev, ...pdfFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);

        // Usamos toast.promise para feedback visual automático
        await toast.promise(
            candidatesAPI.upload(files), // Llamada limpia a la API
            {
                loading: `Procesando ${files.length} documentos con Llama 3...`,
                success: (data) => {
                    setFiles([]);
                    setTimeout(() => onClose(), 1500); // Cerramos el modal tras éxito
                    return `¡${data.message || 'Archivos subidos'}!`;
                },
                error: (err) => `Error: ${err.message}`,
            }
        ).finally(() => {
            setIsUploading(false);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop con Blur */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={!isUploading ? onClose : undefined}
            ></div>

            {/* Modal Card */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Analizar Nuevos Candidatos</h3>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">

                    {/* Dropzone */}
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group">
                        <input
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                        />
                        <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
                            <div className="bg-white dark:bg-slate-700 p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Upload size={24} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">Haz clic o arrastra tus PDFs aquí</p>
                            <p className="text-xs text-slate-400 mt-1">Soporta múltiples archivos (Máx 10MB)</p>
                        </div>
                    </div>

                    {/* Lista de archivos seleccionados */}
                    {files.length > 0 && (
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Archivos listos ({files.length})
                            </p>
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded text-indigo-600 dark:text-indigo-400">
                                            <FileText size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        disabled={isUploading}
                                        className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || isUploading}
                        className={`px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg shadow-indigo-500/30 flex items-center gap-2
                          ${files.length === 0 || isUploading
                                ? 'bg-indigo-400 dark:bg-indigo-500/50 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all'}
                        `}
                    >
                        {isUploading ? <><Loader2 size={16} className="animate-spin" /> Procesando IA...</> : 'Analizar CVs'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UploadModal;