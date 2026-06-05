/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import toast from 'react-hot-toast';

// --- IMPORTS ---
import { candidatesAPI } from '../api/candidates';
import { downloadFile } from '../utils/exportUtils';
import ExportHeader from '../components/export/ExportHeader';
import ExportCard from '../components/export/ExportCard';

const DataExport = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState('csv');

    // --- FETCH DATA ---
    // eslint-disable-next-line react-doctor/no-initialize-state
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Usamos la API existente para traer los datos reales
                const data = await candidatesAPI.getAll();
                
                if (Array.isArray(data)) {
                    setCandidates(data);
                } else {
                    console.warn("Formato de datos inesperado");
                }
            } catch (error) {
                console.error("Error loading data", error);
                // Opcional: toast.error("Error al cargar datos");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- MANEJO DE EXPORTACIÓN ---
    const handleExport = async () => {
        if (candidates.length === 0) return toast.error("No hay datos para exportar.");

        setExporting(true);

        // Simulamos un proceso de "Empaquetado" para efecto visual (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Usamos la utilidad pura para descargar
        downloadFile(candidates, selectedFormat);
        
        setExporting(false);
    };

    return (
        <div className="size-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans relative flex flex-col items-center justify-center p-6 transition-colors duration-500">

            {/* --- FONDO AMBIENTAL --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] size-[800px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] size-[800px] bg-blue-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-4xl"
            >
                <ExportHeader />

                <ExportCard 
                    exporting={exporting}
                    candidatesCount={candidates.length}
                    loading={loading}
                    selectedFormat={selectedFormat}
                    setSelectedFormat={setSelectedFormat}
                    onExport={handleExport}
                />
            </m.div>
        </div>
    );
};

export default DataExport;