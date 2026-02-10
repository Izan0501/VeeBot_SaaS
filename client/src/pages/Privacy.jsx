import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
// --- IMPORTS COMPONENTES PRIVACIDAD ---
import PrivacyHeader from '../components/privacy/PrivacyHeader';
import PrivacyCards from '../components/privacy/PrivacyCards';
import PrivacyContent from '../components/privacy/PrivacyContent';

const Privacy = ({ isPublic = true }) => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const handleBack = () => {
        navigate('/');
    };

    // --- COMPONENTE INTERNO DE CONTENIDO ---
    const Content = () => (
        <div className="max-w-3xl mx-auto px-6 py-12 relative">
            <PrivacyHeader />
            <PrivacyCards />
            <PrivacyContent />
        </div>
    );

    // --- RENDERIZADO CONDICIONAL ---
    if (isPublic) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-emerald-500 selection:text-white">
                <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 origin-left z-[60]" />

                {/* Navbar eliminado (Lo maneja el Layout) */}

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

                {/* Footer eliminado (Lo maneja el Layout) */}
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