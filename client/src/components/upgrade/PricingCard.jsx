import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Rocket, Loader2, Shield, Check, Zap, Sparkles, Star } from 'lucide-react';

const features = [
    { text: "Consultas Ilimitadas al Gemelo Digital", highlight: true },
    { text: "Análisis de CV con IA Avanzada (GPT-4)", highlight: false },
    { text: "Historial de Chat Persistente", highlight: false },
    { text: "Acceso Prioritario a Nuevas Features", highlight: false },
    { text: "Soporte Técnico Premium 24/7", highlight: false },
];

const PricingCard = ({ itemVariants, onCheckout, loading }) => {
    return (
        <motion.div
            variants={itemVariants}
            className="max-w-5xl mx-auto mb-24 relative z-10"
        >
            {/* --- EFECTOS AMBIENTALES DE FONDO --- */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse-slow"></div>

            {/* --- TARJETA PRINCIPAL --- */}
            <div className="relative group rounded-[35px] p-[1px] overflow-hidden">
                {/* Borde Animado Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent translate-x-[-100%] group-hover:animate-shine-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/0 dark:from-white/10 dark:to-white/0 rounded-[35px] pointer-events-none"></div>

                <div className="relative bg-white/80 dark:bg-[#0B0C15]/90 backdrop-blur-3xl rounded-[34px] shadow-2xl overflow-hidden h-full">

                    {/* Textura de Ruido Sutil */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 pointer-events-none"></div>

                    <div className="relative p-8 md:p-12 lg:p-14 flex flex-col md:flex-row gap-12 lg:gap-20 items-center">

                        {/* --- COLUMNA IZQUIERDA: PRECIO Y CTA --- */}
                        <div className="flex-1 w-full text-center md:text-left relative z-10">

                            {/* Badge "Recommended" */}
                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-gradient-to-r from-amber-200/20 to-orange-200/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] backdrop-blur-md"
                            >
                                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-1 rounded-full shadow-lg">
                                    <Crown size={12} fill="currentColor" />
                                </span>
                                Plan Recomendado
                            </motion.div>

                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                                Pro Acceso
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-10 text-base font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                                Desbloquea el potencial completo de tu carrera con herramientas de IA de nivel empresarial.
                            </p>

                            {/* Precio */}
                            <div className="flex items-end justify-center md:justify-start gap-3 mb-10 relative">
                                <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700"></div>
                                <span className="text-7xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-500 tracking-tighter">
                                    $29
                                </span>
                                <div className="flex flex-col items-start pb-4">
                                    <span className="text-lg font-bold text-slate-400 uppercase tracking-widest">USD</span>
                                    <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">/ mes</span>
                                </div>
                            </div>

                            {/* Botón CTA */}
                            <button
                                onClick={onCheckout}
                                disabled={loading}
                                className="w-full relative group/btn overflow-hidden rounded-2xl p-[2px] focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                <span className="relative h-full w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-black px-8 py-5 text-lg font-bold text-white backdrop-blur-3xl transition-all duration-300 group-hover/btn:bg-slate-800 dark:group-hover/btn:bg-slate-900">
                                    {loading ? (
                                        <Loader2 size={24} className="animate-spin text-indigo-400" />
                                    ) : (
                                        <>
                                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover/btn:from-white group-hover/btn:to-white transition-all">
                                                Obtener Acceso Total
                                            </span>
                                            <Rocket size={22} className="text-purple-400 group-hover/btn:text-white group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </span>
                            </button>

                            <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide opacity-80">
                                <Shield size={14} className="text-green-500 fill-green-500/20" />
                                Garantía de 7 días sin riesgo
                            </div>
                        </div>

                        {/* --- DIVISOR VISUAL --- */}
                        <div className="hidden md:block w-[1px] h-64 bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>

                        {/* --- COLUMNA DERECHA: FEATURES --- */}
                        <div className="flex-1 w-full">
                            <div className="mb-6 flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">Todo lo incluido:</span>
                            </div>

                            <ul className="space-y-5">
                                {features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                        className="flex items-start gap-4 group/item"
                                    >
                                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${feature.highlight ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span className={`text-sm md:text-base transition-colors ${feature.highlight ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white'}`}>
                                            {feature.text}
                                            {feature.highlight && (
                                                <Sparkles size={14} className="inline-block ml-2 text-amber-400 animate-pulse" />
                                            )}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Social Proof Miniatura */}
                            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800/50 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="user" className="w-full h-full" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs">
                                    <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                                    </div>
                                    <span className="font-medium text-slate-500 dark:text-slate-400">Elegido por +100 devs</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PricingCard;