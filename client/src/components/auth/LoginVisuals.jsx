import React from 'react';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight } from 'lucide-react';

const LoginVisuals = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* --- FONDO ANIMADO MÓVIL (Solo visible en lg:hidden) --- */}
            <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-slate-900"></div>
                <m.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-[20%] -left-[20%] size-[150vw] bg-indigo-600/30 rounded-full blur-[80px]"
                ></m.div>
                <m.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-[20%] -right-[20%] size-[150vw] bg-purple-600/20 rounded-full blur-[80px]"
                ></m.div>
            </div>

            {/* --- LADO DERECHO: ARTE (Escritorio) --- */}
            <m.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex w-1/2 bg-zinc-950 relative flex-col justify-center p-20 overflow-hidden"
            >
                {/* Botón Volver */}
                <m.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/')}
                    className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 z-20 font-medium"
                >
                    Volver al Inicio <ArrowRight size={18} />
                </m.button>

                {/* --- Ambient Mesh / Orbiting Orbs (Background) --- */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-orbit-1 pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-orbit-2 pointer-events-none"></div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
                    
                    {/* The Typography Section */}
                    <div className="max-w-md z-20 space-y-6 mb-12 flex flex-col items-center">
                        <m.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.5 }}
                            className="inline-flex p-5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[1.5rem] shadow-[0_0_40px_rgba(99,102,241,0.4)]"
                        >
                            <BrainCircuit size={48} className="text-white" />
                        </m.div>

                        <m.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight"
                        >
                            Reclutamiento de Precisión. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Potenciado por IA.</span>
                        </m.h2>

                        <m.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-lg text-zinc-400 leading-relaxed font-medium"
                        >
                            Accede a tu centro de comando. Analiza cientos de perfiles en segundos, descubre talento oculto y toma decisiones estratégicas con precisión milimétrica.
                        </m.p>
                    </div>

                    {/* --- Levitating Liquid Glass Cards (Foreground Stage) --- */}
                    <div className="relative w-full max-w-lg flex justify-center items-center gap-6 z-20">
                        {/* Card 1 (Slightly higher/left) */}
                        <div className="w-64 h-32 bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl animate-float-1 flex items-center p-4 transform -translate-y-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex-shrink-0"></div>
                            <div className="ml-4 space-y-2 w-full">
                                <div className="h-2 bg-white/20 rounded w-3/4"></div>
                                <div className="h-2 bg-indigo-400/40 rounded w-1/2"></div>
                            </div>
                        </div>

                        {/* Card 2 (Slightly lower/right) */}
                        <div className="w-56 h-28 bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl animate-float-2 flex flex-col justify-center p-4 transform translate-y-8">
                            <div className="w-full space-y-3">
                                <div className="flex justify-between">
                                    <div className="h-2 bg-white/20 rounded w-1/3"></div>
                                    <div className="h-2 bg-green-400/40 rounded w-1/4"></div>
                                </div>
                                <div className="h-2 bg-white/10 rounded w-full"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </m.div>
        </>
    );
};

export default LoginVisuals;