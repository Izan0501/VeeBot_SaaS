import React from 'react';
import { m } from 'framer-motion';
import { Suspense } from 'react';

const RechartsQualityBarChart = React.lazy(() => import('recharts').then(mod => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } = mod;
    return {
        default: ({ distributionData, CustomTooltip }) => (
            <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                <BarChart data={distributionData} barSize={60}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {distributionData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    };
}));
import { Lightbulb } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl animate-in zoom-in-95 duration-200">
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{label}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Valor: <span className="font-bold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const QualityBarChart = ({ distributionData, topCandidates, threshold, hasData }) => {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Lightbulb size={20} className="text-amber-500" /> Calidad del Pipeline
                    </h3>
                    <p className="text-sm text-slate-500">
                        Clasificación basada en tu umbral de <strong>{threshold}%</strong>.
                    </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                    {topCandidates} Top
                </div>
            </div>

            <div className="h-64 w-full">
                {hasData ? (
                    <Suspense fallback={<div className="h-full flex items-center justify-center text-slate-400">Cargando gráfico…</div>}>
                        <RechartsQualityBarChart distributionData={distributionData} CustomTooltip={CustomTooltip} />
                    </Suspense>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">Sin datos para graficar.</div>
                )}
            </div>
        </m.div>
    );
};

export default QualityBarChart;