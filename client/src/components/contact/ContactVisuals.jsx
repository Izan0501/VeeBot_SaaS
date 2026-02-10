import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const ContactVisuals = ({ isPublic, wrapperClasses }) => {
    const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
    const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

    return (
        <div className={wrapperClasses}>
            {/* Fondo Animado */}
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-pink-600/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen pointer-events-none" />
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} className="absolute bottom-0 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-600/20 rounded-full blur-[60px] md:blur-[100px] mix-blend-screen pointer-events-none" />

            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 space-y-8 md:space-y-10 text-center lg:text-left xl:text-left w-full">
                <div className="space-y-4">
                    <motion.h1 variants={fadeInUp} className={`font-black tracking-tight text-white leading-[1.1] ${isPublic ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl'}`}>
                        Hablemos <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">de futuro.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-400 max-w-md mx-auto lg:mx-0 xl:mx-0 leading-relaxed">
                        ¿Tienes dudas sobre el plan Agency? ¿Quieres una integración a medida? Estamos aquí para ayudarte a escalar.
                    </motion.p>
                </div>

                <motion.div variants={fadeInUp} className="space-y-4 flex flex-col items-center lg:items-start xl:items-start w-full">
                    <div className="flex items-center gap-4 group bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all w-full max-w-md lg:max-w-none">
                        <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 transition-colors shrink-0">
                            <Mail size={24} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Email Directo</p>
                            <a href="mailto:soporte@veebot.ai" className="text-white hover:text-pink-400 transition-colors text-base sm:text-lg font-medium truncate block">
                                veebot7@gmail.com
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ContactVisuals;