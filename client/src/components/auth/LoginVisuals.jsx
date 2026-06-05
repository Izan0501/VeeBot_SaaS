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
                className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-center p-20 overflow-hidden text-center"
            >
                {/* Botón Volver */}
                <m.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/')}
                    className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 z-20 font-medium"
                >
                    Volver al Inicio <ArrowRight size={18} />
                </m.button>

                {/* Orbes Animados */}
                <m.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] border border-white/5 rounded-full"></m.div>
                <m.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] border border-white/5 rounded-full"></m.div>

                <div className="relative z-10">
                    <m.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.5 }}
                        className="inline-flex p-6 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[2rem] shadow-2xl shadow-indigo-500/30 mb-8"
                    >
                        <BrainCircuit size={64} className="text-white" />
                    </m.div>

                    <m.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        Potencia tu Hiring
                    </m.h2>

                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-lg text-slate-400 max-w-sm mx-auto leading-relaxed"
                    >
                        Accede a tu panel de control y gestiona tus procesos de selección con la potencia de la IA generativa.
                    </m.p>
                </div>
            </m.div>
        </>
    );
};

export default LoginVisuals;