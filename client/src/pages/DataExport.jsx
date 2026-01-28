import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download, FileSpreadsheet, FileJson, FileText, Database,
    CheckCircle, ShieldCheck, Loader2, Server, HardDrive, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const DataExport = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState('csv'); // 'csv' | 'json'

    // --- FETCH DATA (Igual que en Analytics pero solo para tener el conteo real) ---
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch('http://127.0.0.1:8000/candidates', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCandidates(data);
                }
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCount();
    }, []);

    // --- LOGICA DE EXPORTACIÓN ---
    const handleExport = async () => {
        if (candidates.length === 0) return toast.error("No hay datos para exportar.");

        setExporting(true);

        // Simulamos un proceso de "Empaquetado" para efecto visual (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            let content, type, extension;

            if (selectedFormat === 'json') {
                content = JSON.stringify(candidates, null, 2);
                type = "application/json";
                extension = "json";
            } else {
                // CSV Logic
                const separator = ";";
                const headers = ["ID", "Nombre", "Rol Detectado", "Score", "Estado", "Fecha", "Skills", "Email"];
                const csvHeader = headers.join(separator) + "\n";
                const csvRows = candidates.map(c => {
                    const cleanName = c.name ? c.name.replace(/;/g, ",") : "";
                    const cleanRole = c.role ? c.role.replace(/;/g, ",") : "";
                    const cleanSkills = c.skills ? c.skills.join(" | ") : "";
                    const cleanEmail = c.email || "";
                    return [c.id, cleanName, cleanRole, c.score, c.status, c.date, cleanSkills, cleanEmail].join(separator);
                });
                content = "\uFEFF" + csvHeader + csvRows.join("\n");
                type = "text/csv;charset=utf-8;";
                extension = "csv";
            }

            const blob = new Blob([content], { type });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `veebot_export_${new Date().toISOString().slice(0, 10)}.${extension}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Base de datos exportada en ${extension.toUpperCase()}`);
        } catch (e) {
            toast.error("Error al generar el archivo");
        } finally {
            setExporting(false);
        }
    };

    return (
        // CLAVE: transition-colors duration-500 para suavizar el cambio de tema
        <div className="h-full w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans relative flex flex-col items-center justify-center p-6 transition-colors duration-500">

            {/* --- FONDO AMBIENTAL --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]"></div>
                {/* Grid Pattern Sutil */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-4xl"
            >
                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800">
                        <Database size={12} /> Data Center
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Exportación de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Talento</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                        Descarga tu base de conocimiento completa. Compatible con Excel, PowerBI y otros ATS.
                    </p>
                </div>

                {/* --- MAIN CARD --- */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl shadow-emerald-500/10 border border-slate-200 dark:border-slate-800 relative overflow-hidden group transition-colors duration-500">

                    {/* Progress Bar Superior (Decorativa) */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            initial={{ width: 0 }}
                            animate={{ width: exporting ? "100%" : "0%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="bg-slate-50/50 dark:bg-black/20 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center transition-colors duration-500">

                        {/* LADO IZQUIERDO: SELECCIÓN & INFO */}
                        <div className="flex-1 w-full space-y-8">

                            {/* Estadísticas Rápidas */}
                            <div className="flex gap-4">
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex-1 shadow-sm transition-colors duration-300">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Registros</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : candidates.length}
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex-1 shadow-sm transition-colors duration-300">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Estado</p>
                                    <p className="text-2xl font-black text-emerald-500 flex items-center gap-2">
                                        <CheckCircle size={20} /> Activo
                                    </p>
                                </div>
                            </div>

                            {/* Selector de Formato */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Formato de Salida</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSelectedFormat('csv')}
                                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 relative overflow-hidden ${selectedFormat === 'csv' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-slate-600'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${selectedFormat === 'csv' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                            <FileSpreadsheet size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-bold ${selectedFormat === 'csv' ? 'text-emerald-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Excel / CSV</p>
                                            <p className="text-[10px] text-slate-400">Para hojas de cálculo</p>
                                        </div>
                                        {selectedFormat === 'csv' && <motion.div layoutId="check" className="absolute top-2 right-2 text-emerald-500"><CheckCircle size={16} /></motion.div>}
                                    </button>

                                    <button
                                        onClick={() => setSelectedFormat('json')}
                                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 relative overflow-hidden ${selectedFormat === 'json' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-slate-600'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${selectedFormat === 'json' ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                            <FileJson size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-bold ${selectedFormat === 'json' ? 'text-cyan-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>JSON Raw</p>
                                            <p className="text-[10px] text-slate-400">Para desarrolladores</p>
                                        </div>
                                        {selectedFormat === 'json' && <motion.div layoutId="check" className="absolute top-2 right-2 text-cyan-500"><CheckCircle size={16} /></motion.div>}
                                    </button>
                                </div>
                            </div>

                            {/* Botón de Acción Principal */}
                            <button
                                onClick={handleExport}
                                disabled={exporting || loading || candidates.length === 0}
                                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {exporting ? (
                                    <>
                                        <Loader2 size={22} className="animate-spin" />
                                        Generando archivo...
                                    </>
                                ) : (
                                    <>
                                        <Download size={22} className="group-hover:animate-bounce" />
                                        Descargar Base de Datos
                                    </>
                                )}
                            </button>
                        </div>

                        {/* LADO DERECHO: VISUALIZACIÓN HOLOGRÁFICA */}
                        <div className="flex-1 w-full relative h-64 md:h-auto flex items-center justify-center">
                            {/* Círculos Concéntricos Animados */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-64 h-64 border border-emerald-500/20 rounded-full"
                                ></motion.div>
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.2, 0.4] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                    className="w-48 h-48 border border-cyan-500/30 rounded-full absolute"
                                ></motion.div>
                            </div>

                            {/* Icono Central Server */}
                            <div className="relative z-10 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                                <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-4 rounded-2xl text-white shadow-lg">
                                    <Server size={48} />
                                </div>
                                {/* Partículas flotantes (ficticias) */}
                                <motion.div
                                    animate={{ y: -20, opacity: 0 }}
                                    initial={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                    className="absolute -top-4 right-4 text-emerald-500"
                                >
                                    <FileSpreadsheet size={16} />
                                </motion.div>
                                <motion.div
                                    animate={{ y: -30, opacity: 0 }}
                                    initial={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                                    className="absolute -top-2 left-2 text-cyan-500"
                                >
                                    <FileText size={14} />
                                </motion.div>
                            </div>
                        </div>

                    </div>

                    {/* Footer Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
                        <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                            <ShieldCheck size={12} className="text-green-500" />
                            Tus datos están encriptados end-to-end (AES-256). Solo tú tienes acceso a esta descarga.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DataExport;