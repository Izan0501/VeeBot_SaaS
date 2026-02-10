import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl animate-in zoom-in-95 duration-200">
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{payload[0].name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Valor: <span className="font-bold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const RolesPieChart = ({ roleData, total, hasData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col"
        >
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Roles</h3>
                <p className="text-xs text-slate-500 mt-1">Distribución por especialidad.</p>
            </div>

            <div className="flex-1 min-h-[250px] relative">
                {hasData ? (
                    <>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{total}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total</span>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">Sin datos.</div>
                )}
            </div>

            <div className="mt-4 space-y-2">
                {roleData.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{entry.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{entry.value}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default RolesPieChart;