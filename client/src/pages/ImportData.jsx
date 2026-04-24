import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// --- IMPORTS API Y COMPONENTES ---
import { candidatesAPI } from '../api/candidates';
import { analyzeCVWithGroq } from '../api/groqClient';
import ImportHeader from '../components/import/ImportHeader';
import DragDropZone from '../components/import/DragDropZone';
import FileList from '../components/import/FileList';
import UploadStatus from '../components/import/UploadStatus';

const ImportData = () => {
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [statusMsg, setStatusMsg] = useState('');

    // --- MANEJO DE ARCHIVOS ---
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const addFiles = (newFiles) => {
        const pdfFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf');
        if (pdfFiles.length !== newFiles.length) toast.error('Solo se permiten archivos PDF');
        setFiles(prev => [...prev, ...pdfFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files?.length) addFiles(e.target.files);
    };

    const removeFile = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    };

    // ─── FLUJO DE UPLOAD EN 3 PASOS ────────────────────────────────────────────
    // 1. Backend extrae texto PDF         (sin IA, sin red externa)
    // 2. Frontend analiza con Groq        (en paralelo, pool de 5)
    // 3. Frontend guarda resultado        (PATCH /candidates/{id}/analysis)
    // ───────────────────────────────────────────────────────────────────────────
    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setUploadProgress(5);
        setStatusMsg('Subiendo archivos…');

        const formData = new FormData();
        files.forEach(f => formData.append('files', f));

        let pendingCandidates = [];

        try {
            // ── PASO 1: Upload + extracción de texto ──────────────────────────
            const uploadRes = await candidatesAPI.upload(formData);
            pendingCandidates = uploadRes.candidates ?? [];

            if (pendingCandidates.length === 0) {
                throw new Error('No se pudieron procesar los archivos.');
            }

            setUploadProgress(20);
            setStatusMsg(`Analizando ${pendingCandidates.length} CVs con IA…`);

            // ── PASO 2: Análisis Groq en paralelo (pool de 5) ─────────────────
            // async-parallel: Promise.allSettled para que un fallo no bloquee el resto
            const CONCURRENCY = 5;
            let analyzed = 0;

            // Dividir en batches de CONCURRENCY
            for (let i = 0; i < pendingCandidates.length; i += CONCURRENCY) {
                const batch = pendingCandidates.slice(i, i + CONCURRENCY);

                const batchResults = await Promise.allSettled(
                    batch.map(async (candidate) => {
                        // Si el backend no pudo extraer texto, enviamos el nombre como contexto
                        const text = candidate.text || `Candidato: ${candidate.name}. Sin texto disponible.`;
                        const analysis = await analyzeCVWithGroq(text);
                        return { candidate, analysis };
                    })
                );

                // ── PASO 3: Guardar resultados en backend ─────────────────────
                await Promise.allSettled(
                    batchResults.map(async (result) => {
                        if (result.status === 'rejected') {
                            console.error('Análisis fallido para un candidato:', result.reason);
                            toast.error(`Fallo IA: ${result.reason?.message || result.reason}`);
                            return;
                        }
                        const { candidate, analysis } = result.value;
                        
                        // Validar tipos para evitar HTTP 422 en el backend
                        const safeSkills = Array.isArray(analysis.skills) 
                            ? analysis.skills 
                            : (typeof analysis.skills === 'string' ? [analysis.skills] : []);

                        const safeScore = parseInt(analysis.score) || 0;

                        try {
                            await candidatesAPI.saveAnalysis(candidate.id, {
                                role:    String(analysis.role || 'Sin definir'),
                                score:   safeScore,
                                skills:  safeSkills,
                                summary: String(analysis.summary || ''),
                            });
                        } catch (saveErr) {
                            console.error(`No se pudo guardar análisis de ${candidate.name}:`, saveErr);
                            toast.error(`Error al guardar: ${saveErr.message || 'Error desconocido'}`);
                        }
                    })
                );

                analyzed += batch.length;
                // Progreso real: 20% base + 80% por candidatos procesados
                const progress = 20 + Math.round((analyzed / pendingCandidates.length) * 80);
                setUploadProgress(progress);
                setStatusMsg(`Analizados ${analyzed}/${pendingCandidates.length} CVs…`);
            }

            setUploadProgress(100);
            setStatusMsg('¡Completado!');

            setTimeout(() => {
                toast.success(`✅ ${analyzed} CVs procesados correctamente.`);
                setFiles([]);
                setIsUploading(false);
                setUploadProgress(0);
                setStatusMsg('');
                navigate('/dashboard');
            }, 800);

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error al subir archivos');
            setIsUploading(false);
            setUploadProgress(0);
            setStatusMsg('');
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