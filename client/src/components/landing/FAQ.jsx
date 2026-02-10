import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Bot, Zap, Shield, MessageSquare, ChevronDown } from 'lucide-react';

const FAQ = () => {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <section id='FAQ' className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors">
            {/* PATRÓN DE PUNTOS */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-100 dark:from-slate-900 to-transparent"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 rounded-full shadow-sm"
                    >
                        Resolver Dudas
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
                    >
                        Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Frecuentes</span>
                    </motion.h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm inline-block rounded-lg px-2">Todo lo que necesitas saber sobre tu nuevo asistente de reclutamiento.</p>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            icon: <BrainCircuit size={20} />,
                            q: "¿Qué tan inteligente es realmente VeeBot?",
                            a: "VeeBot no usa simples palabras clave. Utilizamos Llama 3.3 (70B), un modelo de lenguaje masivo que entiende el contexto semántico. Sabe que 'React' se relaciona con 'Frontend' y que 'Kubernetes' implica conocimientos de 'DevOps', permitiendo un filtrado humano pero a velocidad máquina."
                        },
                        {
                            icon: <Bot size={20} />,
                            q: "¿En qué consiste el 'Gemelo Digital'?",
                            a: "Es nuestra función más innovadora. La IA analiza el CV y adopta la personalidad y conocimientos del candidato. Puedes chatear con esta simulación para hacerle preguntas técnicas o situacionales ('¿Cómo resolverías X problema?') antes de agendar una entrevista real."
                        },
                        {
                            icon: <Zap size={20} />,
                            q: "¿Cuántos CVs puedo procesar?",
                            a: "Con el plan Agency, el cielo es el límite. Nuestra infraestructura en la nube escala automáticamente para procesar desde 10 hasta 10,000 currículums en minutos, manteniendo siempre la máxima velocidad de análisis."
                        },
                        {
                            icon: <Shield size={20} />,
                            q: "¿Mis datos son privados?",
                            a: "Absolutamente. Tu base de datos de candidatos es un silo aislado y encriptado. No compartimos tus datos con terceros ni los usamos para entrenar modelos públicos. Cumplimos con los estándares de privacidad más estrictos."
                        },
                        {
                            icon: <MessageSquare size={20} />,
                            q: "¿Puede VeeBot escribir correos por mí?",
                            a: "Sí. El sistema extrae automáticamente el email del candidato y genera borradores hiper-personalizados para invitar a entrevistas o enviar rechazos amables, ahorrándote horas de redacción manual."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10' : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg transition-colors ${openFaq === i ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-lg font-bold transition-colors ${openFaq === i ? 'text-indigo-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {item.q}
                                    </span>
                                </div>
                                <div className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                                    <ChevronDown size={20} />
                                </div>
                            </button>

                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 pl-[4.5rem]">
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                                {item.a}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;