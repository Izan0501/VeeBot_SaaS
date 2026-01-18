import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumLock = ({ title, description, icon }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* --- FONDO AMBIENTAL ANIMADO (ORBES) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1], 
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" 
        />
      </div>

      {/* --- TARJETA PRINCIPAL (GLASSMORPHISM) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-8 rounded-[2rem] shadow-2xl shadow-indigo-500/10 overflow-hidden group">
          
          {/* Brillo superior en el borde */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>

          {/* ÍCONO FLOTANTE */}
          <div className="flex justify-center mb-8">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow detrás del icono */}
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full"></div>
              
              <div className="relative w-24 h-24 bg-gradient-to-tr from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center border border-white/50 dark:border-white/10 shadow-lg">
                <span className="text-5xl filter drop-shadow-md">{icon}</span>
                
                {/* Candado pequeño superpuesto */}
                <div className="absolute -bottom-2 -right-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2 rounded-xl shadow-lg flex items-center justify-center">
                    <Lock size={16} strokeWidth={3} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* TEXTOS */}
          <div className="text-center mb-8 space-y-3">
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-2"
            >
                <Sparkles size={12} /> Premium Feature
            </motion.div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {description}
            </p>
          </div>

          {/* BOTÓN "LIQUID SHINE" (El mismo de la Landing) */}
          <div className="relative group/btn">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover/btn:opacity-75 transition duration-500"></div>
            
            <motion.button
              onClick={() => navigate('/settings')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-4 bg-slate-900 dark:bg-white rounded-xl leading-none flex items-center justify-center gap-3 overflow-hidden shadow-xl"
            >
               {/* Shine effect */}
               <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-slate-900/10 to-transparent skew-x-[25deg] group-hover/btn:animate-shine" />

              <span className="relative z-10 font-bold text-lg text-white dark:text-slate-900 tracking-wide">
                Desbloquear ahora ($29)
              </span>
              
              <ArrowRight size={20} className="relative z-10 text-indigo-200 dark:text-indigo-600" />
            </motion.button>
          </div>

          <p className="text-center mt-5 text-xs text-slate-400 font-medium">
            Garantía de devolución de 7 días. Cancela cuando quieras.
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default PremiumLock;