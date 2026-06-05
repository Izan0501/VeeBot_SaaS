import React from 'react';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Sparkles, Download } from 'lucide-react';

const ExecutiveSummary = ({ stats, roleData }) => {
    const navigate = useNavigate();

    return (
        <m.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10 bg-gradient-to-r from-indigo-900 to-violet-900 rounded-3xl p-1 shadow-xl shadow-indigo-900/20"
        >
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-white/10">
                <div className="p-4 bg-white/10 rounded-full relative">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                    <BrainCircuit size={32} className="text-indigo-300 relative z-10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-white font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                        <Sparkles size={16} className="text-yellow-400" /> Executive AI Summary
                    </h3>
                    <p className="text-indigo-100/80 text-sm leading-relaxed max-w-2xl">
                        {stats.total > 0
                            ? `Analizando ${stats.total} perfiles. La calidad promedio es del ${stats.avgScore}%. Se han detectado ${stats.topCandidates} candidatos de alto impacto listos para entrevista. El rol predominante es ${roleData[0]?.name || 'N/A'}.`
                            : "Esperando datos para generar insights inteligentes. Sube CVs para comenzar."}
                    </p>
                </div>
                <div className="hidden md:block">
                    <button aria-label="Interactive control" type="button"
                        onClick={() => navigate('/export')}
                        className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-colors border border-white/10 flex items-center gap-2"
                    >
                        <Download size={14} /> Ver Reporte Completo
                    </button>
                </div>
            </div>
        </m.div>
    );
};

export default ExecutiveSummary;