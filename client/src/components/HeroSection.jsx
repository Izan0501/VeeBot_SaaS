import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles, BrainCircuit, Database, FileText, Zap, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] } // Easing ultra suave
        },
    };

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 perspective-[2000px]">

            {/* ==================== 1. FONDO ATMOSFÉRICO VIVO ==================== */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid Futurista Sutil */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                {/* Orbes de Luz Volumétrica (Aurora Effect) */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen"
                />
                <motion.div
                    animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-fuchsia-600/15 rounded-full blur-[180px] mix-blend-screen"
                />
                <motion.div
                    animate={{ scale: [1.1, 0.9, 1.1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[20%] w-[40vw] h-[40vh] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 pt-20 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                {/* ==================== 2. COLUMNA IZQUIERDA: CONTENIDO TEXTUAL ==================== */}
                <motion.div
                    className="lg:col-span-6 text-center lg:text-left"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge Premium */}
                    <motion.div variants={itemVariants} className="inline-flex items-center justify-center lg:justify-start mb-8 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-800/50 ring-1 ring-white/10">
                            <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                            <span className="text-xs font-bold text-indigo-100/90 uppercase tracking-wider">
                                La Nueva Era del Recruiting
                            </span>
                        </div>
                    </motion.div>

                    {/* Headline Masivo con Efecto de Luz Líquida */}
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl xl:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight relative z-10">
                        Contrata talento,<br />
                        {/* Contenedor para el texto con gradiente y resplandor */}
                        <span className="relative inline-block p-2 -m-2">
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 via-purple-600/50 to-pink-600/50 blur-3xl opacity-40 animate-pulse"></span>
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 animate-gradient-x font-extrabold">
                                olvida los PDFs.
                            </span>
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Transforma montañas de currículums no estructurados en <strong className="text-slate-200 font-semibold">datos comparables y listos para IA</strong>. El único ATS impulsado por Llama 3.3 que realmente entiende el contexto.
                    </motion.p>

                    {/* Botones de Acción Ultra-Premium */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                        <button
                            onClick={() => navigate('/register')}
                            className="group relative w-full sm:w-auto"
                        >
                            {/* Glow Trasero del Botón */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition-all duration-500 scale-95 group-hover:scale-100"></div>

                            <div className="relative px-8 py-4 bg-white text-slate-950 rounded-xl font-black text-lg flex items-center justify-center gap-3 overflow-hidden transition-transform group-hover:scale-[1.02] active:scale-[0.98]">
                                {/* Efecto de Brillo Pasante (Shine Effect) */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shine" style={{ animationDuration: '1.5s' }} />

                                <span className="relative z-10 flex items-center gap-2">
                                    Prueba Gratis Ahora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={() => handleScroll('features')}
                            className="px-8 py-4 rounded-xl font-bold text-lg text-white bg-slate-800/50 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800 transition-all w-full sm:w-auto flex items-center justify-center gap-3 group hover:border-indigo-500/50"
                        >
                            <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                <Zap size={18} fill="currentColor" />
                            </div>
                            Ver Demo Interactiva
                        </button>
                    </motion.div>

                    {/* Trust Badges Minimalistas */}
                    <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-emerald-500/20"><CheckCircle size={14} className="text-emerald-400" /></div>
                            <span>Sin tarjeta requerida</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-emerald-500/20"><CheckCircle size={14} className="text-emerald-400" /></div>
                            <span>Setup en 2 minutos</span>
                        </div>
                    </motion.div>

                </motion.div>

                {/* ==================== 3. COLUMNA DERECHA: LA ESCULTURA DIGITAL FLOTANTE ==================== */}
                <motion.div
                    className="lg:col-span-6 relative perspective-[2000px] h-[600px] hidden lg:block"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                >
                    {/* Esta es la magia: una composición 3D que flota */}
                    <motion.div
                        animate={{
                            y: [-15, 15, -15],
                            rotateX: [5, -5, 5],
                            rotateY: [-5, 5, -5]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="relative w-full h-full"
                    >
                        {/* --- ELEMENTO 1 (FONDO): EL CAOS (PDFs Desestructurados) --- */}
                        <div
                            className="absolute top-1/4 left-0 w-72 h-96 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 opacity-60 origin-bottom-left"
                            style={{ transform: "translateZ(-100px) rotateZ(-10deg) rotateY(10deg)" }}
                        >
                            <div className="flex items-center gap-3 mb-6 opacity-70">
                                <FileText size={24} className="text-slate-400" />
                                <div className="h-4 bg-slate-700 rounded w-24"></div>
                            </div>
                            <div className="space-y-3 opacity-50">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-2 bg-slate-600 rounded w-full"></div>)}
                            </div>
                            {/* Sello de "Caos" */}
                            <div className="absolute bottom-4 right-4 text-red-400/30 text-4xl font-black uppercase tracking-widest rotate-[-15deg] border-4 border-red-400/30 p-2 rounded-lg">RAW DATA</div>
                        </div>

                        {/* --- CONEXIONES NEURONALES (Luz que conecta) --- */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: "translateZ(0px)" }}>
                            <defs>
                                <linearGradient id="neural-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                                    <stop offset="50%" stopColor="rgba(168, 85, 247, 0.8)" />
                                    <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
                                </linearGradient>
                            </defs>
                            {/* Líneas curvas animadas */}
                            <motion.path
                                d="M 150 300 C 250 300, 350 200, 450 250"
                                stroke="url(#neural-flow)"
                                strokeWidth="3" fill="none"
                                strokeDasharray="10 5"
                                animate={{ strokeDashoffset: [0, -100] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                filter="drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))"
                            />
                            <motion.path
                                d="M 180 350 C 280 350, 300 400, 420 350"
                                stroke="url(#neural-flow)"
                                strokeWidth="2" fill="none"
                                strokeDasharray="5 5"
                                animate={{ strokeDashoffset: [0, -100] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                opacity="0.6"
                            />
                        </svg>

                        {/* --- ELEMENTO 2 (CENTRO): EL MOTOR IA (El Cerebro) --- */}
                        <div
                            className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/30 z-10 animate-pulse-slow"
                            style={{ transform: "translateZ(50px)" }}
                        >
                            <BrainCircuit size={48} className="text-white" />
                            {/* Anillos de energía orbitando */}
                            <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-[2rem] animate-spin-slow scale-110"></div>
                            <div className="absolute inset-0 border-2 border-purple-400/30 rounded-[2rem] animate-reverse-spin scale-125 opacity-70"></div>
                        </div>

                        {/* --- ELEMENTO 3 (FRENTE): EL ORDEN (Tarjeta de Candidato Premium) --- */}
                        <motion.div
                            className="absolute top-1/4 right-0 w-80 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] z-20"
                            style={{ transform: "translateZ(150px) rotateY(-10deg)" }}
                            whileHover={{ scale: 1.05, rotateY: 0, translateZ: "180px" }} // Efecto al pasar el mouse
                        >
                            {/* Header Tarjeta */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                        S.
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Sofia Rodriguez</h3>
                                        <p className="text-indigo-300 text-sm">Senior Full Stack Dev</p>
                                    </div>
                                </div>
                                <div className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-green-500/30">
                                    <CheckCircle size={12} /> TOP MATCH
                                </div>
                            </div>

                            {/* Datos Estructurados (Skills) */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-2 flex items-center gap-2"><Database size={12} /> Skills Detectadas</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['React', 'Node.js', 'AWS', 'TypeScript', 'AI Integration'].map(skill => (
                                            <span key={skill} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {/* Score Bar */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">AI Score</span>
                                        <span className="text-indigo-400 font-bold">98%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '98%' }}
                                            transition={{ duration: 2, delay: 2, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 relative"
                                        >
                                            <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-r from-transparent to-white/50 animate-shine" style={{ animationDuration: '2s' }}></div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                            {/* Decoración inferior */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 blur-3xl rounded-full -z-10 pointer-events-none"></div>
                        </motion.div>

                    </motion.div>
                </motion.div>

            </div>

            {/* Separador de Sección Curvo (Forzado a Slate-950) */}
            <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20">
                <svg className="relative block w-[calc(100%+3px)] h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-950"></path>
                </svg>
            </div>

        </section>
    );
};

export default HeroSection;