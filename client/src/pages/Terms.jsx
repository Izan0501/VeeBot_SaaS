import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { m, useScroll, useSpring } from 'framer-motion';
// --- IMPORTS COMPONENTES ---
import TermsHeader from '../components/terms/TermsHeader';
import TermsContent from '../components/terms/TermsContent';

const Content = () => (
    <div className="max-w-3xl mx-auto px-6 py-12 relative">
        <TermsHeader />
        <TermsContent />
    </div>
);

const Terms = ({ isPublic = true }) => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const handleBack = () => {
        // En vista pública vuelve al home, en privada no se usa este botón (hay sidebar)
        navigate('/');
    };


    if (isPublic) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-white dark:text-white transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
                <m.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-[60]" />

                {/* Navbar eliminado (Lo maneja el Layout) */}

                {/* BOTÓN VOLVER (ESTILO CONTACT) */}
                <m.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                    onClick={handleBack}
                    className="fixed top-24 left-6 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:scale-105 transition-all group"
                >
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </m.button>

                <div className="relative pt-20">
                    {/* Fondo Decorativo Solo Público */}
                    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                        <div className="absolute top-[10%] left-[-10%] size-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-[10%] right-[-10%] size-[500px] bg-purple-500/5 rounded-full blur-[100px]"></div>
                    </div>
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

export default Terms;