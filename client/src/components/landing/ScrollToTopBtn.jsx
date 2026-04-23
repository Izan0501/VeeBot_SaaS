import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // <--- IMPORTANTE
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTopBtn = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const toggleVisibility = () => {
            // Mostrar después de 300px de scroll
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // --- LÓGICA DEL PORTAL ---
    // Creamos el JSX del botón
    const buttonContent = (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    // Usamos z-[9999] para asegurar que esté sobre tooltips, modales y el footer
                    className="fixed bottom-24 right-6 z-[9999] p-1"
                >
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative w-14 h-14 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#0A0C14]/90 backdrop-blur-2xl shadow-2xl shadow-indigo-500/30 border border-white/20 dark:border-white/10 group overflow-hidden"
                    >
                        {/* --- ANILLO DE PROGRESO SVG (High Fidelity) --- */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="46"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-slate-100 dark:text-slate-800"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="46"
                                fill="none"
                                stroke="url(#gradient-scroll)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                style={{ pathLength: scaleX }}
                            />
                            <defs>
                                <linearGradient id="gradient-scroll" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />   {/* Indigo-500 */}
                                    <stop offset="50%" stopColor="#8b5cf6" />   {/* Violet-500 */}
                                    <stop offset="100%" stopColor="#ec4899" />  {/* Pink-500 */}
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* --- ICONO CON EFECTO NEÓN --- */}
                        <div className="relative z-10 text-slate-700 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-300">
                            <ArrowUp size={24} strokeWidth={2.5} className="group-hover:-translate-y-1 transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)" />
                        </div>

                        {/* --- GLOW INTERNO AL HOVER --- */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return ReactDOM.createPortal(buttonContent, document.body);
};

export default ScrollToTopBtn;