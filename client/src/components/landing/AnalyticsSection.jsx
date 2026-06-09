import React from 'react';
import { Target, Clock, BrainCircuit } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const AnalyticsSection = () => {
    return (
        <section className="py-24 md:py-32 bg-white dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300 ease-in-out border-y border-neutral-200/50 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <ScrollReveal direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white mb-6 tracking-tight transition-colors duration-300 ease-in-out">
                            Mide lo que importa. <span className="text-indigo-600 dark:text-indigo-400">Escala tu equipo.</span>
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
                            Métricas en tiempo real sobre la precisión de la IA, el tiempo ahorrado y el pipeline de candidatos procesados.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Match UI (Large) */}
                    <ScrollReveal direction="left" delay={200} className="md:col-span-2 h-full">
                        <div className="h-full relative group bg-neutral-50 dark:bg-neutral-900/50 backdrop-blur-md transform-gpu border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[320px] animate-float-1">
                            {/* Glow effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm mb-6">
                                    <Target size={14} className="text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest transition-colors duration-300 ease-in-out">Precisión del Match IA</span>
                                </div>
                                <h3 className="text-4xl font-black text-neutral-900 dark:text-white mb-2 transition-colors duration-300 ease-in-out">94.8%</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors duration-300 ease-in-out">Alineación semántica promedio con tus Job Descriptions.</p>
                            </div>

                            {/* Abstract visual */}
                            <div className="mt-8 flex gap-2 items-end h-32 relative z-10">
                                {[40, 60, 45, 80, 55, 90, 75, 100].map((height, i) => (
                                    <div key={i} className="flex-1 bg-indigo-100 dark:bg-indigo-500/20 rounded-t-lg relative group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30 transition-colors" style={{ height: `${height}%` }}>
                                        <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 dark:bg-indigo-400 rounded-t-lg transition-all duration-500" style={{ height: `${height * 0.7}%` }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card 2: Speed (Small) */}
                    <ScrollReveal direction="right" delay={400} className="md:col-span-1 h-full">
                        <div className="h-full relative group bg-neutral-50 dark:bg-neutral-900/50 backdrop-blur-md transform-gpu border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[320px] animate-float-2">
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm mb-6">
                                    <Clock size={14} className="text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest transition-colors duration-300 ease-in-out">Velocidad</span>
                                </div>
                                <h3 className="text-4xl font-black text-neutral-900 dark:text-white mb-2 transition-colors duration-300 ease-in-out">-70%</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors duration-300 ease-in-out">Tiempo de contratación ahorrado por posición.</p>
                            </div>

                            <div className="mt-12 space-y-4 relative z-10">
                                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-4 overflow-hidden shadow-inner">
                                    <div className="bg-neutral-400 dark:bg-neutral-600 h-full w-[100%]" />
                                </div>
                                <div className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-4 overflow-hidden relative shadow-inner">
                                    <div className="absolute top-0 left-0 bottom-0 bg-emerald-500 w-[30%] shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider pt-2">
                                    <span>Antes (Manual)</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">Ahora (VeeBot)</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card 3: AI Engine (Medium/Small) */}
                    <ScrollReveal direction="up" delay={600} className="md:col-span-3 h-full">
                        <div className="h-full relative group bg-neutral-50 dark:bg-neutral-900/50 backdrop-blur-md transform-gpu border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden min-h-[160px] flex flex-col md:flex-row items-center justify-between gap-8 animate-float-3">
                            <div className="flex-shrink-0 z-10 relative">
                                <div className="h-6 w-6 bg-indigo-500 rounded-full animate-pulse-glow mb-4"></div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm mb-4">
                                    <BrainCircuit size={14} className="text-fuchsia-600 dark:text-fuchsia-400" />
                                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest transition-colors duration-300 ease-in-out">Motor Llama 3.3</span>
                                </div>
                                <h3 className="text-2xl font-black text-neutral-900 dark:text-white transition-colors duration-300 ease-in-out">Candidatos Procesados</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 transition-colors duration-300 ease-in-out">Más de 500,000 currículums analizados estructuradamente.</p>
                            </div>

                            <div className="w-full md:w-1/2 relative z-10">
                                <div className="mt-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden transform-gpu">
                                    <div className="bg-indigo-500 h-2.5 rounded-full animate-grow" style={{ width: '85%' }}></div>
                                </div>
                                <div className="mt-2 flex justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                    <span>0</span>
                                    <span>8.5k Procesados</span>
                                </div>
                            </div>
                            
                            {/* Background mesh/glow */}
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-500/10 dark:bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

export default AnalyticsSection;
