import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = ({ isPublic = true }) => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const handleBack = () => {
        navigate('/');
    };

    const cardVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    const Content = () => (
        <div className="max-w-3xl mx-auto px-6 py-12 relative">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase mb-6 tracking-widest border border-emerald-200 dark:border-emerald-800">
                    <Shield size={14} /> Datos protegidos
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">Política de Privacidad</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                    Tu privacidad es nuestra prioridad. Te explicamos claramente qué hacemos (y qué no hacemos) con tu información.
                </p>
            </motion.div>

            {/* Grid Interactivo */}
            <motion.div
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
            >
                <motion.div variants={cardVariant} whileHover={{ y: -5 }} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-blue-500 transition-colors group">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform"><Database size={24} /></div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">No entrenamos con tus datos</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Los CVs que subes NO se utilizan para entrenar nuestros modelos de IA. Son 100% privados.</p>
                </motion.div>

                <motion.div variants={cardVariant} whileHover={{ y: -5 }} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-purple-500 transition-colors group">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform"><Eye size={24} /></div>
                    <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Acceso Restringido</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Solo tú tienes acceso a los candidatos. Ni siquiera nuestro equipo técnico accede sin permiso.</p>
                </motion.div>
            </motion.div>

            {/* Contenido Texto */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="space-y-12 prose prose-slate dark:prose-invert max-w-none"
            >
                <section>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Información que Recopilamos</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-lg">Recopilamos solo lo necesario:</p>
                    <ul className="list-none space-y-3 pl-0">
                        {['Datos de cuenta (Nombre, Email, Pass encriptada)', 'Datos de facturación (Procesados por Lemon Squeezy)', 'Datos de uso (CVs y Vectores)'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {item}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. Almacenamiento y Seguridad</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        Utilizamos <strong>MongoDB Atlas</strong> con encriptación en reposo y <strong>Pinecone</strong> para vectores. Toda la comunicación es SSL/TLS (HTTPS).
                    </p>
                </section>

                <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 text-center font-medium">
                        ¿Preguntas de seguridad? <a href="mailto:security@veebot.ai" className="text-emerald-600 hover:underline">security@veebot.ai</a>
                    </p>
                </section>
            </motion.div>
        </div>
    );

    if (isPublic) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-emerald-500 selection:text-white">
                <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 origin-left z-[60]" />

                <Navbar />

                {/* BOTÓN VOLVER (ESTILO CONTACT) */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                    onClick={handleBack}
                    className="fixed top-24 left-6 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:scale-105 transition-all group"
                >
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </motion.button>

                <div className="pt-20">
                    <Content />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-300">
            <Content />
        </div>
    );
};

export default Privacy;