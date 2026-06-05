/* eslint-disable react-doctor/rendering-hydration-mismatch-time */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { Check, X, Crown, Rocket } from 'lucide-react';

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <section id="pricing" className="py-32 bg-slate-100 dark:bg-slate-900 relative overflow-hidden border-t border-slate-200 dark:border-slate-800">
            {/* Efectos de fondo ÚNICOS para esta sección */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Header Pricing */}
                <div className="text-center mb-20">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                        Planes Simples
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Inversión Transparente
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
                        Sin tarifas ocultas ni contratos complicados. Comienza gratis y pásate a PRO cuando estés listo para volar.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* --- PLAN FREE --- */}
                    <m.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-300 flex flex-col h-full shadow-lg"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Perfecto para probar la tecnología.</p>
                        </div>

                        <div className="text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">$0 <span className="text-xl text-slate-400 font-medium">/mes</span></div>

                        <ul className="space-y-5 mb-10 flex-1">
                            {['5 CVs al mes', 'Análisis de IA Básico', 'Soporte Comunitario'].map((feat, i) => (
                                <li suppressHydrationWarning key={feat.id || feat.name || feat.title || crypto.randomUUID()} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1"><Check size={12} className="text-slate-600 dark:text-slate-400" /></div> {feat}
                                </li>
                            ))}
                            {['Sin exportación de datos', 'Sin chat con candidatos', 'Sin comparador'].map((feat, i) => (
                                <li suppressHydrationWarning key={feat.id || feat.name || feat.title || crypto.randomUUID()} className="flex items-center gap-3 text-slate-400 dark:text-slate-600 text-sm line-through decoration-slate-300 dark:decoration-slate-700">
                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-800"><X size={12} /></div> {feat}
                                </li>
                            ))}
                        </ul>

                        <button aria-label="Interactive control" type="button"
                            onClick={() => navigate('/register')}
                            className="w-full py-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Crear Cuenta Gratis
                        </button>
                    </m.div>

                    {/* --- PLAN AGENCY (HERO - GLOWING) --- */}
                    <m.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group h-full"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative bg-slate-900 rounded-[2.2rem] p-10 border border-slate-700 h-full flex flex-col shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0">
                                <div className="bg-gradient-to-bl from-indigo-600 to-purple-700 text-white text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg">
                                    Recomendado
                                </div>
                            </div>

                            <div className="mb-8 relative z-10">
                                <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
                                    Agency <Crown size={24} className="text-yellow-400 fill-yellow-400-slow" />
                                </h3>
                                <p className="text-indigo-200 text-sm">Poder ilimitado para reclutadores serios.</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8 relative z-10">
                                <span className="text-6xl font-black text-white tracking-tighter">$29</span>
                                <span className="text-slate-400 text-lg">/mes</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

                            <ul className="space-y-5 mb-10 flex-1 relative z-10">
                                {[
                                    'Cargas de PDF Ilimitadas',
                                    'Motor Llama 3.3 (70B) Turbo',
                                    'Chat con Gemelo Digital (AI Twin)',
                                    'Comparador Versus 1vs1',
                                    'Exportación de Datos (Excel/CSV)',
                                    'Soporte Prioritario WhatsApp'
                                ].map((feat, i) => (
                                    <li suppressHydrationWarning key={feat.id || feat.name || feat.title || crypto.randomUUID()} className="flex items-center gap-3 text-white text-sm font-bold">
                                        <div className="bg-indigo-500 text-white rounded-full p-1 shadow-lg shadow-indigo-500/50"><Check size={14} strokeWidth={4} /></div> {feat}
                                    </li>
                                ))}
                            </ul>

                            <button aria-label="Interactive control" type="button"
                                onClick={() => navigate('/upgrade')}
                                className="w-full py-5 rounded-2xl bg-white text-indigo-950 font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-3 relative z-10 group/btn overflow-hidden"
                            >
                                <div className="absolute inset-0 size-full bg-gradient-to-r from-transparent via-indigo-100 to-transparent -translate-x-full group-hover/btn:animate-shine"></div>
                                <Rocket size={20} className="text-indigo-600" />
                                Obtener Acceso Total
                            </button>
                        </div>
                    </m.div>

                </div>
            </div>
        </section>
    );
};

export default Pricing;