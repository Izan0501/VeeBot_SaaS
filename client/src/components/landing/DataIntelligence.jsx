/* eslint-disable react-doctor/rendering-hydration-mismatch-time */
import React from 'react';
import { m } from 'framer-motion';
import { Table, CheckCircle, ArrowRight, FileSpreadsheet } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };


const DataIntelligence = () => {
  // --- VARIANTES DE ANIMACIÓN (Copiadas para mantener aislamiento) ---




  return (
    <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors border-y border-slate-200 dark:border-slate-800">

      {/* PATRÓN DE FONDO DE GRILLA (Con máscara radial para suavidad) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Glow Ambiental (Excel Green) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 size-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >

          {/* --- COLUMNA IZQUIERDA: TEXTO Y BENEFICIOS --- */}
          <m.div variants={itemVariants} className="text-center lg:text-left order-1">

            <m.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide mb-6 shadow-sm backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50"
            >
              <Table size={14} /> <span>Data Intelligence</span>
            </m.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
              Del caos del PDF <br className="hidden md:block" />
              <span className="dark: dark: text-emerald-600 dark:text-emerald-400">al orden del Excel.</span>
            </h2>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Los reclutadores aman Excel, pero odian cargar datos. VeeBot extrae automáticamente nombre, email, skills y puntaje, permitiéndote <strong>exportar todo a CSV con un clic</strong>.
            </p>

            <ul className="space-y-4 mb-10 text-left max-w-md mx-auto lg:mx-0">
              {[
                "Extracción automática de datos de contacto.",
                "Tabla comparativa lado a lado.",
                "Ordenamiento por Score de relevancia.",
                "Compatible con ATS (Greenhouse, Lever)."
              ].map((item, i) => (
                <m.li suppressHydrationWarning key={item.id || item.name || item.title || crypto.randomUUID()}
                  custom={i}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: (i) => ({
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.1, type: "spring", stiffness: 100 }
                    })
                  }}
                  className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-medium group"
                >
                  <div className="mt-0.5 size-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-all duration-300">
                    <CheckCircle size={14} strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </m.li>
              ))}
            </ul>

            <m.button
              whileHover={{ x: 5 }}
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group"
            >
              <span>Ver ejemplo de exportación</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </m.button>
          </m.div>

          {/* --- COLUMNA DERECHA: VISUALIZACIÓN INTERACTIVA --- */}
          <m.div
            variants={itemVariants}
            className="order-2 relative perspective-[1000px] w-full max-w-md mx-auto lg:max-w-full z-20"
          >
            {/* Tarjeta Principal (Rotada) */}
            <m.div
              whileHover={{ rotateY: 0, rotateZ: 0, scale: 1.03 }}
              initial={{ rotateY: -10, rotateZ: 2 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              className="relative bg-white dark:bg-slate-950 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 p-2 transform-gpu"
            >
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 relative overflow-hidden">

                {/* Brillo de fondo animado */}
                <div className="absolute top-0 right-0 size-[300px] bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                {/* Header Fake Table */}
                <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4 opacity-50">
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                  <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                </div>

                {/* Rows Animados */}
                <div className="space-y-3 relative z-10">
                  {[1, 2, 3].map((row) => (
                    <m.div
                      key={row}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      whileHover="hover"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: row * 0.1
                      }}
                      variants={{
                        hover: {
                          scale: 1.05,
                          y: -4,
                          boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.25)",
                          zIndex: 10
                        }
                      }}
                      className="relative flex items-center gap-4 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-400/50 dark:hover:border-emerald-500/50"
                    >
                      <m.div
                        variants={{
                          hover: {
                            scale: 1.15,
                            rotate: 12,
                            backgroundColor: "rgba(209, 250, 229, 1)",
                            color: "#059669"
                          }
                        }}
                        className="size-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-colors duration-300"
                      >
                        CV
                      </m.div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 overflow-hidden relative isolate">
                          <m.div
                            variants={{
                              hover: {
                                x: ["-100%", "200%"],
                                opacity: 1,
                                transition: {
                                  duration: 1.2,
                                  ease: "easeInOut",
                                  repeat: Infinity
                                }
                              }
                            }}
                            initial={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-1/2 h-full z-10"
                          />
                        </div>
                        <m.div
                          variants={{ hover: { width: "70%" } }}
                          className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 w-1/2 transition-colors duration-300"
                        />
                      </div>
                      <div className="px-3 py-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 group-hover:border-emerald-300 dark:group-hover:border-emerald-700 transition-colors duration-300">
                        <m.span
                          variants={{ hover: { scale: 1.1 } }}
                          className="inline-block"
                        >
                          9{4 - row}%
                        </m.span>
                      </div>
                    </m.div>
                  ))}
                </div>
              </div>

              <m.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-5 -right-2 md:-right-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/40 flex items-center gap-3 cursor-pointer z-30 border border-white/20 backdrop-blur-md"
              >
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <FileSpreadsheet size={20} className="text-white" />
                </div>
                <div className="text-left whitespace-nowrap">
                  <p className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Exportar</p>
                  <p className="text-sm font-bold leading-none">Candidates.csv</p>
                </div>
              </m.div>

            </m.div>
            <div className="absolute top-10 -left-4 md:-left-8 size-full bg-slate-200 dark:bg-slate-800 rounded-3xl -z-10 transform -rotate-3 scale-95 opacity-50 border border-slate-300 dark:border-slate-700 transition-transform duration-500 group-hover:rotate-0"></div>
            <div className="absolute top-20 -left-8 md:-left-16 size-full bg-slate-100 dark:bg-slate-900 rounded-3xl -z-20 transform -rotate-6 scale-90 opacity-30 transition-transform duration-500 group-hover:rotate-0"></div>
          </m.div>
        </m.div>
      </div>
    </section>
  );
};

export default DataIntelligence;