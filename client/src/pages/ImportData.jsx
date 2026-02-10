import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Hook para redirección

// --- IMPORTS API Y COMPONENTES ---
import { candidatesAPI } from '../api/candidates';
import ImportHeader from '../components/import/ImportHeader';
import DragDropZone from '../components/import/DragDropZone';
import FileList from '../components/import/FileList';
import UploadStatus from '../components/import/UploadStatus';

const ImportData = () => {
    const navigate = useNavigate(); // Inicializamos el hook
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    const addFiles = (newFiles) => {
        const pdfFiles = Array.from(newFiles).filter(file => file.type === "application/pdf");
        if (pdfFiles.length !== newFiles.length) toast.error("Solo se permiten archivos PDF");
        setFiles(prev => [...prev, ...pdfFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            addFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            addFiles(e.target.files);
        }
    };

    const removeFile = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    };

    // --- LÓGICA DE SUBIDA (API) ---
    const handleUpload = async () => {
        if (files.length === 0) return;
        setIsUploading(true);
        setUploadProgress(10);

        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        try {
            // Simulación visual de progreso
            const interval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 500);

            // Llamada a la API
            await candidatesAPI.upload(formData);

            clearInterval(interval);
            setUploadProgress(100);

            // Esperar animación y REDIRIGIR
            setTimeout(() => {
                toast.success(`¡${files.length} CVs procesados con éxito!`);
                setFiles([]);
                setIsUploading(false);
                setUploadProgress(0);

                // Redirección al Dashboard
                navigate('/dashboard');

            }, 800);

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error al subir archivos");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                <ImportHeader />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <DragDropZone
                        dragActive={dragActive}
                        onDrag={handleDrag}
                        onDrop={handleDrop}
                        onFileSelect={handleChange}
                    />

                    {/* --- PANEL LATERAL --- */}
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

                            <FileList
                                files={files}
                                onRemove={removeFile}
                                isUploading={isUploading}
                            />

                            <UploadStatus
                                isUploading={isUploading}
                                progress={uploadProgress}
                                hasFiles={files.length > 0}
                                onUpload={handleUpload}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ImportData;