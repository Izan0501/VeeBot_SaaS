import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

const AuthVisuals = () => {
    const slideUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <>
            {/* FONDO ANIMADO MÓVIL (Solo visible en lg:hidden) */}
            <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-slate-900"></div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-[20%] -left-[20%] w-[150vw] h-[150vw] bg-indigo-600/30 rounded-full blur-[80px]"
                ></motion.div>
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-[20%] -right-[20%] w-[150vw] h-[150vw] bg-purple-600/20 rounded-full blur-[80px]"
                ></motion.div>
            </div>

            {/* LADO IZQUIERDO: ARTE DESKTOP */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex w-1/2 bg-slate-950 relative flex-col justify-between p-16 overflow-hidden"
            >
                {/* Anillo Exterior */}
                <motion.div
                    initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 0.1 }}
                    animate={{ x: "-50%", y: "-50%", scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute top-1/2 left-1/2 w-[700px] h-[700px] border-2 border-white/10 rounded-full pointer-events-none"
                />

                {/* Anillo Interior */}
                <motion.div
                    initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 0.2 }}
                    animate={{ x: "-50%", y: "-50%", scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 1.5, delay: 0.1, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute top-1/2 left-1/2 w-[550px] h-[550px] border-[3px] border-indigo-500/30 rounded-full pointer-events-none shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                />

                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none"
                ></motion.div>

                {/* Contenido Texto */}
                <div className="relative z-10 mt-10">
                    <motion.div variants={slideUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <Star size={12} className="fill-indigo-300" /> Únete a los líderes
                    </motion.div>

                    <motion.h1 variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                        El futuro del <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x">Reclutamiento.</span>
                    </motion.h1>

                    <motion.p variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Deja de leer CVs manualmente. Únete a miles de reclutadores que usan VeeBot para encontrar el talento oculto en segundos.
                    </motion.p>
                </div>

                <div className="relative z-10 space-y-4">
                    {["Análisis semántico con IA", "Filtrado automático", "Seguridad Enterprise"].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="flex items-center gap-3 text-slate-300"
                        >
                            <div className="p-1 rounded-full bg-green-500/20 text-green-400"><CheckCircle2 size={16} /></div>
                            <span className="text-sm font-medium">{item}</span>
                        </motion.div>
                    ))}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="relative z-10 text-xs text-slate-600">
                    © {new Date().getFullYear()} VeeBot Inc. Todos los derechos reservados.
                </motion.div>
            </motion.div>
        </>
    );
};

export default AuthVisuals;