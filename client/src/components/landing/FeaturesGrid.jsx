import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, Container } from 'lucide-react';

const FeaturesGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="features" className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors">
      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Arquitectura de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Próxima Generación</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            No es solo un ATS. Es un ecosistema de inteligencia artificial diseñado para escalar sin fricción.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[600px]"
        >
          {/* TARJETA 1: RAG (Grande, Izquierda) */}
          <motion.div variants={itemVariants} className="md:col-span-4 md:row-span-2 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-500">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BrainCircuit size={32} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Motor RAG Vectorial</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md">
                  Olvídate de las keywords exactas. VeeBot utiliza <strong>Llama 3.3 (70B)</strong> y <strong>Pinecone DB</strong> para entender el <em>significado</em> detrás de cada CV, encontrando talento que otros sistemas ignoran.
                </p>
              </div>

              <div className="mt-8 flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                <div className="h-2 w-24 bg-indigo-500 rounded-full animate-pulse"></div>
                <div className="h-2 w-16 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                <div className="h-2 w-32 bg-pink-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-indigo-50 via-white/50 to-transparent dark:from-indigo-900/20 dark:via-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          </motion.div>

          {/* TARJETA 2: FASTAPI (Arriba Derecha) */}
          <motion.div variants={itemVariants} className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-8 border border-slate-700 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Zap size={24} />
                </div>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider">FastAPI</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Backend Asíncrono</h3>
              <p className="text-slate-400 text-sm">Procesamiento paralelo de alta velocidad. Cero bloqueos.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors duration-500"></div>
          </motion.div>

          {/* TARJETA 3: DOCKER (Abajo Derecha) */}
          <motion.div variants={itemVariants} className="md:col-span-2 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
              <Container size={100} className="dark:text-blue-400" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:rotate-12 transition-transform">
                <Container size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Docker Ready</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Despliegue instantáneo en cualquier nube con contenedores optimizados.</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;