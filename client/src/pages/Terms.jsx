import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

const Terms = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const handleBack = () => {
        const token = localStorage.getItem('token');
        if (token) navigate('/dashboard'); else navigate('/');
    };

    // Animación de secciones
    const sectionVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">

            {/* BARRA DE PROGRESO DE LECTURA */}
            <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-[60]" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={handleBack}>
                    <div className="bg-indigo-600 p-1.5 rounded-lg text-white group-hover:scale-110 transition-transform"><FileText size={18} /></div>
                    <span className="font-bold text-lg tracking-tight">VeeBot Legal</span>
                </div>
                <button onClick={handleBack} className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    <ArrowLeft size={16} /> Volver
                </button>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-20 relative">

                {/* Fondo Decorativo Fijo */}
                <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                    <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]"></div>
                </div>

                {/* Header */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="mb-16 text-center">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest text-xs uppercase mb-3 block">Última actualización: Enero 2026</span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">Términos de Servicio</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Por favor lee estos términos cuidadosamente antes de usar nuestra plataforma de reclutamiento IA.
                    </p>
                </motion.div>

                {/* Contenido (Staggered Animation) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="prose prose-slate dark:prose-invert max-w-none space-y-12"
                >
                    {[
                        { title: "1. Aceptación", content: "Al acceder y utilizar VeeBot ('el Servicio'), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo, no podrás acceder." },
                        { title: "2. Inteligencia Artificial", content: "VeeBot utiliza LLMs avanzados (Llama 3.3). La IA puede cometer errores. La decisión final de contratación es 100% humana." },
                        { title: "3. Suscripciones", content: "El servicio se ofrece bajo suscripción mensual. Pagos seguros vía Lemon Squeezy. Cancela cuando quieras desde tu panel." },
                        { title: "4. Tus Datos", content: "Tú conservas todos los derechos sobre tus CVs. No vendemos ni compartimos tus datos con terceros." }
                    ].map((section, i) => (
                        <motion.section key={i} variants={sectionVariant} className="group hover:pl-4 transition-all duration-300 border-l-2 border-transparent hover:border-indigo-500">
                            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="text-indigo-600/50 group-hover:text-indigo-600 transition-colors">#</span> {section.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{section.content}</p>
                        </motion.section>
                    ))}

                    <motion.section variants={sectionVariant} className="p-8 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><FileText size={100} /></div>
                        <h4 className="font-bold text-xl mb-2 relative z-10">Contacto Legal</h4>
                        <p className="text-slate-500 dark:text-slate-400 relative z-10">
                            Para consultas legales o reportar violaciones, contáctanos en <a href="mailto:legal@veebot.ai" className="text-indigo-600 hover:underline font-bold">legal@veebot.ai</a>.
                        </p>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;