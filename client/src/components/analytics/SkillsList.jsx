import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';

const SkillsList = ({ topSkillsData, total }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Fingerprint size={20} className="text-cyan-500" /> Habilidades Top
                    </h3>
                    <p className="text-sm text-slate-500">Tecnologías más demandadas en tu base.</p>
                </div>
            </div>
            <div className="space-y-4">
                {topSkillsData.length > 0 ? topSkillsData.map((item, index) => (
                    <div key={index} className="group">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                            <span className="text-slate-400 text-xs">{item.count}</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.count / (total || 1)) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                className={`h-full rounded-full bg-gradient-to-r ${index === 0 ? 'from-cyan-500 to-blue-500' : index === 1 ? 'from-blue-500 to-indigo-500' : 'from-indigo-400 to-violet-400'}`}
                            />
                        </div>
                    </div>
                )) : <div className="h-40 flex items-center justify-center text-slate-400 italic">Insuficientes datos de skills.</div>}
            </div>
        </motion.div>
    );
};

export default SkillsList;