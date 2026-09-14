import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Suspense } from 'react';
import { Activity, TrendingUp, Calendar } from 'lucide-react';

const RechartsTrendChart = React.lazy(() => import('recharts').then(mod => {
    const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, ReferenceLine } = mod;
    return {
        default: ({ trendData, averageScore, CustomTooltip, CustomActiveDot }) => (
            <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                        </linearGradient>
                        <filter id="glow" height="300%" width="300%" x="-100%" y="-100%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" strokeOpacity={0.1} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={15} minTickGap={30} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <ReferenceLine y={averageScore} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" filter="url(#glow)" activeDot={CustomActiveDot} animationDuration={1500} />
                    <Brush dataKey="day" height={40} y={340} stroke="transparent" fill="transparent" travellerWidth={50} tickFormatter={() => ""} alwaysShowText={false}>
                        <AreaChart>
                            <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={1} fill="#818cf8" fillOpacity={0.2} />
                        </AreaChart>
                    </Brush>
                </AreaChart>
            </ResponsiveContainer>
        )
    };
}));

// --- TOOLTIP ULTRA-PREMIUM ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const score = payload[0].value;
        // Determinamos el color y mensaje según el puntaje
        const statusColor = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500';
        const bgStatus = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';

        return (
            <div className="bg-white/95 dark:bg-[#0f111a]/95 backdrop-blur-xl p-4 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl min-w-[180px] animate-in zoom-in-95 duration-200 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                    <div className={`size-2 rounded-full ${bgStatus} shadow-[0_0_8px_currentColor]`}></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">Puntaje Promedio</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-black ${statusColor} tracking-tight`}>
                            {score}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">/ 100</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

// --- PUNTO ACTIVO PULSANTE ---
const CustomActiveDot = (props) => {
    const { cx, cy, stroke } = props;
    return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} className="overflow-visible">
            <circle cx="10" cy="10" r="6" fill={stroke} stroke="white" strokeWidth="2" />
            <circle cx="10" cy="10" r="10" stroke={stroke} strokeWidth="1" fill="none" opacity="0.5">
                <animate attributeName="r" from="6" to="14" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
};

const TrendChart = ({ trendData, hasData }) => {
    // Calculamos el promedio para la línea de referencia
    const averageScore = hasData
        ? Math.round(trendData.reduce((acc, curr) => acc + curr.score, 0) / trendData.length)
        : 0;

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 relative overflow-hidden bg-white dark:bg-[#0f111a] p-6 md:p-8 rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/40 dark:shadow-none"
        >
            {/* Fondo decorativo sutil */}
            <div className="absolute top-0 right-0 size-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 relative z-10 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                            <Activity size={22} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Tendencia de Calidad
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 pl-1">
                        Evolución de candidatos en tiempo real.
                    </p>
                </div>

                {hasData && (
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Promedio Global</span>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-emerald-500" />
                                <span className="text-lg font-black text-slate-800 dark:text-white">{averageScore}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* GRÁFICO */}
            <div className="h-[380px] w-full relative z-10">
                {hasData ? (
                    <Suspense fallback={<div className="h-full flex items-center justify-center text-slate-400">Cargando gráfico…</div>}>
                        <RechartsTrendChart trendData={trendData} averageScore={averageScore} CustomTooltip={CustomTooltip} CustomActiveDot={CustomActiveDot} />
                    </Suspense>
                ) : (
                    <div className="size-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
                        <Calendar size={48} className="mb-4 opacity-50" />
                        <p className="font-medium">No hay datos suficientes para mostrar tendencias.</p>
                    </div>
                )}
            </div>

            {/* Estilos globales inyectados para personalizar el Brush específicamente (Recharts es difícil de estilizar inline) */}
            <style>{`
                .recharts-brush-slide {
                    fill: rgba(99, 102, 241, 0.1) !important; /* Color de selección suave */
                    stroke: none !important;
                }
                .recharts-brush-traveller rect {
                    fill: #6366f1 !important; /* Color de los manejadores */
                    width: 6px !important;
                    rx: 3px !important; /* Bordes redondeados */
                    transform: translateX(22px); /* Centrar visualmente */
                }
                .recharts-brush-traveller line {
                    display: none !important; /* Ocultar las lineas feas por defecto */
                }
                /* Sombra para el gráfico */
                .recharts-layer.recharts-area-chart path.recharts-curve {
                    filter: drop-shadow(0px 4px 10px rgba(99, 102, 241, 0.3));
                }
            `}</style>
        </m.div>
    );
};

export default TrendChart;