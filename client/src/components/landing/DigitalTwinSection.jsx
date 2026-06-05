/* eslint-disable react-doctor/rendering-hydration-mismatch-time */
import React from 'react';
import { m } from 'framer-motion';
import { Fingerprint, Cpu, Network, ScanFace, Sparkles, Binary, ShieldCheck } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 50, damping: 20 }
    }
  };

const glowVariants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };


const DigitalTwinSection = () => {
  // Variantes de animación orquestadas






  return (
    <section id='DigitalTwin' className="relative py-32 overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-500">

      {/* --- FONDO ANIMADO (Grid Matrix) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto size-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 size-[400px] rounded-full bg-purple-500 opacity-10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* --- HEADER --- */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={12} /> VeeBot Neural Core v2.0
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            Digital <span className=" text-indigo-600 dark:text-indigo-400">Twin</span> Technology
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            No leemos CVs, <strong className="text-slate-900 dark:text-white">simulamos personas</strong>. Nuestra IA crea una réplica digital cognitiva de cada candidato para predecir el éxito laboral con una precisión sin precedentes.
          </p>
        </m.div>

        {/* --- GRID DE ARQUITECTURA (Bento Grid) --- */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >

          {/* CARD 1: EL NÚCLEO (Central - Grande) */}
          <m.div variants={cardVariants} className="md:col-span-8 bg-slate-50 dark:bg-[#0B0C15] rounded-[32px] p-1 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="bg-white dark:bg-[#0e1019] rounded-[28px] h-full p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">

              {/* Texto */}
              <div className="relative z-10 md:w-1/2">
                <div className="size-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 mb-6 shadow-lg shadow-indigo-500/20">
                  <Fingerprint size={32} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Perfil Holográfico</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Transformamos datos planos (PDFs) en un modelo vectorial tridimensional. Analizamos no solo las *skills*, sino la trayectoria, el potencial latente y la compatibilidad cultural.
                </p>

                <div className="flex flex-wrap gap-2">
                  {['Semántica Profunda', 'Inferencia Lógica', 'Zero-Bias'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visualización "Digital Twin" Animada */}
              <div className="relative md:w-1/2 flex justify-center items-center h-[250px] w-full">
                {/* Círculos concéntricos animados */}
                <m.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute size-[200px] border border-dashed border-indigo-500/20 rounded-full"
                ></m.div>
                <m.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute size-[260px] border border-dotted border-purple-500/20 rounded-full"
                ></m.div>

                {/* El "Gemelo" */}
                <m.div
                  variants={glowVariants}
                  animate="animate"
                  className="relative z-10 size-32 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40"
                >
                  <ScanFace size={64} className="text-white opacity-90" />
                  {/* Línea de escaneo */}
                  <m.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-full h-[2px] bg-white/50 shadow-[0_0_10px_white] left-0"
                  ></m.div>
                </m.div>
              </div>
            </div>
          </m.div>

          {/* CARD 2: NEURAL NETWORK (Derecha Superior) */}
          <m.div variants={cardVariants} className="md:col-span-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[32px] p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-64 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
              <Network className="mb-6 opacity-80" size={40} />
              <h3 className="text-2xl font-bold mb-2">Red Neuronal 70B</h3>
              <p className="text-sm opacity-60 dark:opacity-70 leading-relaxed">
                Potenciado por Llama 3.3. Entiende el contexto como un humano, procesa a la velocidad de la luz.
              </p>
            </div>

            <div className="mt-8 relative h-24 flex items-end gap-1">
              {/* Barras de datos simuladas — scaleY en lugar de height para GPU compositing */}
              {[40, 70, 50, 90, 60, 80, 45, 95].map((h, i) => (
                <m.div
                  suppressHydrationWarning key={h.id || h.name || h.title || crypto.randomUUID()}
                  initial={{ scaleY: 0.1, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "backOut" }}
                  style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                  className="flex-1 bg-white/20 dark:bg-slate-900/20 rounded-t-sm hover:bg-indigo-500 transition-colors"
                />
              ))}
            </div>
          </m.div>

          {/* CARD 3: DATA PROCESSING (Izquierda Inferior) */}
          <m.div variants={cardVariants} className="md:col-span-4 bg-white dark:bg-[#0B0C15] rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Binary size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">Live Stream</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Procesamiento en Tiempo Real</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Arquitectura asíncrona (FastAPI) que permite ingerir miles de CVs sin latencia.
            </p>
            {/* Decoración código */}
            <div className="mt-6 p-4 bg-slate-900 rounded-xl overflow-hidden opacity-90 group-hover:scale-105 transition-transform duration-500">
              <div className="flex flex-col gap-2">
                <div className="h-1.5 w-3/4 bg-slate-700 rounded-full"></div>
                <div className="h-1.5 w-1/2 bg-emerald-500 rounded-full"></div>
                <div className="h-1.5 w-2/3 bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </m.div>

          {/* CARD 4: SECURITY (Derecha Inferior - Grande) */}
          <m.div variants={cardVariants} className="md:col-span-8 bg-gradient-to-r from-slate-100 to-white dark:from-[#0f111a] dark:to-[#0B0C15] rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-lg relative flex items-center justify-between group overflow-hidden">
            <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={28} />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Privacidad Blindada</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Tus datos nunca entrenan modelos públicos. Entorno aislado con encriptación militar. Cumplimiento GDPR nativo.
              </p>
            </div>

            {/* Decoración visual de candado/seguridad */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/10 to-transparent flex items-center justify-center">
              <m.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="size-32 bg-indigo-500/5 rounded-full border border-indigo-500/20 flex items-center justify-center"
              >
                <div className="size-20 bg-indigo-500/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ShieldCheck size={40} className="text-indigo-500/50" />
                </div>
              </m.div>
            </div>
          </m.div>

        </m.div>
      </div>
    </section>
  );
};

export default DigitalTwinSection;