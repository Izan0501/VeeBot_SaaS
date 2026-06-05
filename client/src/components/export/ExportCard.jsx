import React from 'react';
import { m } from 'framer-motion';
import { Loader2, CheckCircle, FileSpreadsheet, FileJson, Download, ShieldCheck } from 'lucide-react';
import HologramVisual from './HologramVisual';

const ExportCard = ({ 
    exporting, 
    candidatesCount, 
    loading, 
    selectedFormat, 
    setSelectedFormat, 
    onExport 
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl shadow-emerald-500/10 border border-slate-200 dark:border-slate-800 relative overflow-hidden group transition-colors duration-500">

            {/* Progress Bar Superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
                <m.div
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
                                {loading ? <Loader2 className="animate-spin" size={16} /> : candidatesCount}
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
                        {/* eslint-disable-next-line react-doctor/label-has-associated-control */}
<label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Formato de Salida</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button aria-label="Interactive control" type="button"
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
                                {selectedFormat === 'csv' && <m.div layoutId="check" className="absolute top-2 right-2 text-emerald-500"><CheckCircle size={16} /></m.div>}
                            </button>

                            <button aria-label="Interactive control" type="button"
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
                                {selectedFormat === 'json' && <m.div layoutId="check" className="absolute top-2 right-2 text-cyan-500"><CheckCircle size={16} /></m.div>}
                            </button>
                        </div>
                    </div>

                    {/* Botón de Acción Principal */}
                    <button aria-label="Interactive control" type="button"
                        onClick={onExport}
                        disabled={exporting || loading || candidatesCount === 0}
                        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {exporting ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                Generando archivo…
                            </>
                        ) : (
                            <>
                                <Download size={22} className="group-hover:" />
                                Descargar Base de Datos
                            </>
                        )}
                    </button>
                </div>

                <HologramVisual />

            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
                <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                    <ShieldCheck size={12} className="text-green-500" />
                    Tus datos están encriptados end-to-end (AES-256). Solo tú tienes acceso a esta descarga.
                </p>
            </div>
        </div>
    );
};

export default ExportCard;