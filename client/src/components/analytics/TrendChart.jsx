import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl animate-in zoom-in-95 duration-200">
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{label || payload[0].name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Valor: <span className="font-bold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const TrendChart = ({ trendData, hasData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity size={20} className="text-indigo-500" /> Tendencia de Calidad
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Evolución del puntaje de candidatos en este periodo.</p>
                </div>
            </div>
            <div className="h-80 w-full">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
                            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            <Brush
                                dataKey="day"
                                height={20}
                                stroke="#818cf8"
                                fill="transparent"
                                tickFormatter={() => ""}
                                alwaysShowText={false}
                                travellerWidth={10}
                                startIndex={Math.max(0, trendData.length - 15)}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">Sin datos en este rango.</div>
                )}
            </div>
        </motion.div>
    );
};

export default TrendChart;