import React, { useRef } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles, BrainCircuit, Database, FileText, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
    };


const HeroSection = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // --- OPTIMIZED VARIANTS (Menos propiedades costosas) ---




    // -- Removed handleScroll since we rely on native CSS scroll-smooth via <a aria-label="Interactive control"> tags

    return (
        <section id="hero" ref={containerRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-950 perspective-[2000px] transition-colors duration-300 ease-in-out">

            {/* --- CSS PURO PARA ANIMACIONES CONTINUAS (0% LAG) --- */}
            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -20px) scale(1.1); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-30px, 30px) scale(0.9); }
                }
                @keyframes neural-dash {
                    to { stroke-dashoffset: -200; }
                }
                .animate-float-slow { animation: float-slow 15s ease-in-out infinite; will-change: transform; }
                .animate-float-medium { animation: float-medium 20s ease-in-out infinite; will-change: transform; }
                .neural-line { animation: neural-dash 4s linear infinite; will-change: stroke-dashoffset; }
                .gpu-layer { transform: translateZ(0); will-change: transform, opacity; }
            `}</style>

            {/* ==================== 1. FONDO ATMOSFÉRICO VIVO (GPU OPTIMIZED) ==================== */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                {/* Orbes optimizados */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-float-slow gpu-layer" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-fuchsia-500/10 dark:bg-fuchsia-600/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-float-medium gpu-layer" />
            </div>

            {/* CAMBIO RESPONSIVE AQUÍ: 
               - pt-32 pb-48: Mucho padding vertical en móvil para evitar choque con la ola.
               - lg:py-20: Padding normal en desktop.
            */}
            <div className="max-w-7xl mx-auto px-6 relative z-10 pt-32 pb-48 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                {/* ==================== 2. COLUMNA IZQUIERDA ==================== */}
                <m.div
                    className="lg:col-span-6 text-center lg:text-left"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Headline 
                       CAMBIO RESPONSIVE: text-4xl en móvil para evitar desbordes, sube a 5xl, 7xl y 8xl
                    */}
                    <m.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white mb-6 lg:mb-8 leading-[1.1] tracking-tight relative z-10 gpu-layer">
                        Contrata talento,<br />
                        <span className="relative inline-block p-2 -m-2">
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 dark:from-indigo-600/50 dark:via-purple-600/50 dark:to-pink-600/50 blur-3xl opacity-40"></span>
                            <span className="relative z-10 dark: dark: dark: animate-gradient-x font-extrabold text-indigo-600 dark:text-indigo-400">
                                olvida los PDFs.
                            </span>
                        </span>
                    </m.h1>

                    {/* Subtitle
                       CAMBIO RESPONSIVE: text-lg en móvil, text-xl en desktop
                    */}
                    <m.p variants={itemVariants} className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 lg:mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Transforma montañas de currículums no estructurados en <strong className="text-slate-900 dark:text-slate-200 font-semibold">datos comparables y listos para IA</strong>. El único ATS impulsado por Llama 3.3 que realmente entiende el contexto.
                    </m.p>

                    {/* Botones */}
                    <m.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5 w-full">
                        <button aria-label="Interactive control" type="button"
                            onClick={() => navigate('/onboarding')}
                            className="group relative w-full sm:w-auto transform-gpu"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition-all duration-500 scale-95 group-hover:scale-100"></div>
                            <div className="relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-lg flex items-center justify-center gap-3 overflow-hidden transition-transform group-hover:scale-[1.02] active:scale-[0.98]">
                                <div className="absolute inset-0 size-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shine" style={{ animationDuration: '1s' }} />
                                <span className="relative z-10 flex items-center gap-2">
                                    Prueba Gratis Ahora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </button>

                        <button aria-label="Interactive control" type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById('DigitalTwin');
                                if (el) {
                                    const offset = el.getBoundingClientRect().top + window.scrollY - 80;
                                    window.scrollTo({ top: offset, behavior: 'smooth' });
                                }
                            }}
                            className="px-8 py-4 rounded-xl font-bold text-lg text-slate-700 dark:text-white bg-white/50 dark:bg-slate-800/50 backdrop-blur-md transform-gpu border border-slate-200 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all w-full sm:w-auto flex items-center justify-center gap-3 group hover:border-indigo-500/50 shadow-sm"
                        >
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                                <Zap size={18} fill="currentColor" />
                            </div>
                            Ver Demo Interactiva
                        </button>
                    </m.div>

                    {/* Trust Badges 
                       CAMBIO RESPONSIVE: flex-wrap para que no se rompan en pantallas muy pequeñas
                    */}
                    <m.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20"><CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" /></div>
                            <span>Sin tarjeta requerida</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20"><CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" /></div>
                            <span>Setup en 2 minutos</span>
                        </div>
                    </m.div>
                </m.div>

                {/* ==================== 3. COLUMNA DERECHA: 3D OPTIMIZADO ==================== */}
                <m.div
                    className="lg:col-span-6 relative perspective-[2000px] h-[400px] lg:h-[600px] hidden lg:block"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                >
                    <m.div
                        animate={{
                            y: [-10, 10, -10],
                            rotateX: [2, -2, 2],
                            rotateY: [-2, 2, -2]
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="relative size-full will-change-transform"
                    >
                        {/* --- FONDO: CAOS --- */}
                        <div
                            className="absolute top-1/4 left-0 w-72 h-96 bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm transform-gpu border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 opacity-80 dark:opacity-60 origin-bottom-left shadow-xl dark:shadow-none"
                            style={{ transform: "translateZ(-80px) rotateZ(-10deg) rotateY(10deg)" }}
                        >
                            <div className="flex items-center gap-3 mb-6 opacity-70">
                                <FileText size={24} className="text-slate-500 dark:text-slate-400" />
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                            </div>
                            <div className="space-y-3 opacity-50">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-2 bg-slate-300 dark:bg-slate-600 rounded w-full"></div>)}
                            </div>
                            <div className="absolute bottom-4 right-4 text-red-500/40 dark:text-red-400/30 text-4xl font-black uppercase tracking-widest rotate-[-15deg] border-4 border-red-500/40 dark:border-red-400/30 p-2 rounded-lg">RAW DATA</div>
                        </div>

                        {/* --- CONEXIONES --- */}
                        <svg className="absolute inset-0 size-full pointer-events-none" style={{ transform: "translateZ(0px)" }}>
                            <defs>
                                <linearGradient id="neural-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                                    <stop offset="50%" stopColor="rgba(168, 85, 247, 0.8)" />
                                    <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 150 300 C 250 300, 350 200, 450 250"
                                stroke="url(#neural-flow)" strokeWidth="3" fill="none" strokeDasharray="10 10"
                                className="neural-line"
                                filter="drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))"
                            />
                            <path
                                d="M 180 350 C 280 350, 300 400, 420 350"
                                stroke="url(#neural-flow)" strokeWidth="2" fill="none" strokeDasharray="5 5"
                                className="neural-line duration-1000"
                                style={{ opacity: 0.6 }}
                            />
                        </svg>

                        {/* --- CENTRO: MOTOR IA --- */}
                        <div
                            className="absolute top-1/3 left-1/3 size-32 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 dark:shadow-indigo-500/30 z-10"
                            style={{ transform: "translateZ(50px)" }}
                        >
                            <BrainCircuit size={48} className="text-white animate-pulse" />
                            <div className="absolute inset-0 border-2 border-indigo-200/50 dark:border-indigo-400/30 rounded-[2rem] animate-[spin_8s_linear_infinite] scale-110"></div>
                            <div className="absolute inset-0 border-2 border-purple-200/50 dark:border-purple-400/30 rounded-[2rem] animate-[spin_12s_linear_infinite_reverse] scale-125 opacity-70"></div>
                        </div>

                        {/* --- FRENTE Y DORSO: TARJETA 3D FLIP --- */}
                        <div
                            className="absolute top-1/4 right-0 w-80 h-[320px] group [perspective:1000px] z-20"
                            style={{ transform: "translateZ(120px) rotateY(-5deg)" }}
                        >
                            <div className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                {/* FRONT FACE */}
                                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl transform-gpu border border-indigo-100 dark:border-indigo-500/30 rounded-3xl p-6 shadow-2xl shadow-indigo-500/20 dark:shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)]">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                                S.
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sofia Rodriguez</h3>
                                                <p className="text-indigo-600 dark:text-indigo-300 text-sm font-medium">Senior Full Stack Dev</p>
                                            </div>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-green-200 dark:border-green-500/30">
                                            <CheckCircle size={12} /> TOP MATCH
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-2 flex items-center gap-2"><Database size={12} /> Skills Detectadas</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['React', 'Node.js', 'AWS', 'TypeScript', 'AI Integration'].map(skill => (
                                                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">AI Score</span>
                                                <span className="text-indigo-600 dark:text-indigo-400 font-bold">98%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 w-[98%] relative">
                                                    <div className="absolute right-0 top-0 size-full bg-gradient-to-r from-transparent to-white/50 animate-[shimmer_2s_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 size-40 bg-indigo-500/10 dark:bg-indigo-600/20 blur-3xl rounded-full -z-10 pointer-events-none"></div>
                                </div>
                                
                                {/* BACK FACE */}
                                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-indigo-100 dark:border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center">
                                    <div className="size-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white mb-6 shadow-lg">
                                        <Sparkles size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Análisis de IA</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        El perfil de Sofia coincide al 98% con los requerimientos técnicos y culturales del puesto vacante.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </m.div>
                </m.div>

            </div>

            {/* Separador - WAVE
               La clave aquí es que el contenedor de arriba tiene suficiente padding-bottom (pb-48)
               para que el texto nunca llegue a esta posición absoluta.
            */}
            <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
                <svg className="relative block w-[calc(100%+3px)] h-[60px] sm:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-white dark:fill-slate-950 transition-colors duration-500"></path>
                </svg>
            </div>

        </section>
    );
};

export default HeroSection;