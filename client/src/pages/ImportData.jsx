import React, { useState } from 'react';
import { m } from 'framer-motion';
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
    const statusMsg = React.useRef('');

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
        statusMsg.current = 'Subiendo archivos…';

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
            statusMsg.current = `Analizando ${pendingCandidates.length} CVs con IA…`;

            // ── PASO 2 & 3: Análisis Groq y Guardado en paralelo ─────────────────
            // eslint-disable-next-line react-doctor/async-await-in-loop
            let analyzed = 0;

            await Promise.allSettled(
                pendingCandidates.map(async (candidate) => {
                    try {
                        // Use the raw CV text for email extraction BEFORE applying the Groq fallback.
                        // If we run the regex on the placeholder string it will always return null.
                        const rawCvText = candidate.text || '';
                        const text = rawCvText || `Candidato: ${candidate.name}. Sin texto disponible.`;

                        const analysis = await analyzeCVWithGroq(text);

                        // Extract email from raw CV text — must use rawCvText, NOT the Groq fallback string.
                        // Permissive regex: tolerates whitespace/newlines injected by the PDF parser around @ and dots.
                        const permissiveRegex = /[a-zA-Z0-9._%+\-]+\s*@\s*[a-zA-Z0-9.\-]+\s*\.\s*[a-zA-Z]{2,}/;
                        const emailMatch = rawCvText.match(permissiveRegex);
                        // Strip all whitespace artifacts to reconstruct the canonical email
                        const extractedEmail = emailMatch ? emailMatch[0].replace(/\s+/g, '').toLowerCase() : null;

                        const safeSkills = Array.isArray(analysis.skills) 
                            ? analysis.skills 
                            : (typeof analysis.skills === 'string' ? [analysis.skills] : []);

                        const safeScore = parseInt(analysis.score) || 0;

                        await candidatesAPI.saveAnalysis(candidate.id, {
                            role:    String(analysis.role || 'Sin definir'),
                            score:   safeScore,
                            skills:  safeSkills,
                            summary: String(analysis.summary || ''),
                            email:   extractedEmail,
                        });

                        analyzed += 1;
                        const progress = 20 + Math.round((analyzed / pendingCandidates.length) * 80);
                        setUploadProgress(progress);
                        statusMsg.current = `Analizados ${analyzed}/${pendingCandidates.length} CVs…`;

                    } catch (err) {
                        console.error(`Análisis fallido para ${candidate.name}:`, err);
                        toast.error(`Error en ${candidate.name}: ${err.message || 'Error desconocido'}`);
                    }
                })
            );


            setUploadProgress(100);
            statusMsg.current = '¡Completado!';

            setTimeout(() => {
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'} max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto flex items-center p-4 gap-3 relative`}>
                        <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div className="flex-1 text-sm font-medium text-white">
                            {`✅ ${analyzed} CVs procesados correctamente.`}
                        </div>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="text-neutral-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-neutral-800"
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ), { duration: 2000 });
                setFiles([]);
                setIsUploading(false);
                setUploadProgress(0);
                statusMsg.current = '';
                navigate('/dashboard');
            }, 800);

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error al subir archivos');
            setIsUploading(false);
            setUploadProgress(0);
            statusMsg.current = '';
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
                    <m.div
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
                    </m.div>
                </div>
            </div>
        </div>
    );
};

export default ImportData;