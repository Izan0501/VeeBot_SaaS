import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle, ArrowRight, BrainCircuit,
  Zap, Code, Check, Crown, Rocket, X, Bot, Shield, Database, Cpu, Share2, FileCode, ChevronDown, Lock, FileSpreadsheet, Table, Container, MessageSquare,
  Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // --- LÓGICA DE MODO OSCURO ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScrollListener = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScrollListener);
    return () => window.removeEventListener('scroll', handleScrollListener);
  }, []);

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  // --- VARIANTES DE ANIMACIÓN ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>

      {/* BOTÓN FLOTANTE DE CAMBIO DE TEMA */}
      <motion.button
        onClick={toggleTheme}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-indigo-500/20 text-slate-600 dark:text-yellow-400 transition-all"
      >
        {isDarkMode ? <Sun size={24} className="animate-spin-slow" /> : <Moon size={24} className="text-slate-600" />}
      </motion.button>

      <Navbar />

      {/* ================================================================================== */}
      {/* 1. HERO SECTION */}
      {/* ================================================================================== */}
      <HeroSection onNavigate={handleNavigation} isScrolled={isScrolled} />
      {/* ================================================================================== */}
      {/* 2. DATA INTELLIGENCE (GRID PATTERN + BORDERS) */}
      {/* ================================================================================== */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors border-y border-slate-200 dark:border-slate-800">
        {/* PATRÓN DE FONDO DE GRILLA */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase mb-4 shadow-sm">
                <Table size={14} /> Data Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                Del caos del PDF <br />
                <span className="text-emerald-600 dark:text-emerald-400">al orden del Excel.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Los reclutadores aman Excel, pero odian cargar datos. VeeBot extrae automáticamente nombre, email, skills, experiencia y puntaje de cada CV y te permite <strong>exportar todo a CSV/Excel con un solo clic</strong>.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Extracción automática de datos de contacto.",
                  "Tabla comparativa lado a lado.",
                  "Ordenamiento por Score de relevancia.",
                  "Compatible con ATS externos (Greenhouse, Lever)."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"><CheckCircle size={14} /></div>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline decoration-2 underline-offset-4 transition-all">
                Ver ejemplo de exportación <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* VISUALIZACIÓN DE TRANSFORMACIÓN */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2 relative">
              <div className="relative z-10 bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  {/* Header Fake Table */}
                  <div className="flex gap-4 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 opacity-50">
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  {/* Rows */}
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="flex items-center gap-4 mb-3">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">CV</div>
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="w-12 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">9{row}%</div>
                    </div>
                  ))}

                  {/* Floating Export Button */}
                  <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow hover:scale-105 transition-transform cursor-pointer">
                    <FileSpreadsheet size={24} />
                    <div>
                      <p className="text-xs font-medium opacity-80">Exportar</p>
                      <p className="font-bold">Candidates.csv</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-10 -left-10 w-full h-full bg-slate-200 dark:bg-slate-800 rounded-3xl -z-10 transform -rotate-2"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEPARATOR FADE */}
      <div className="h-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 w-full"></div>

      {/* ================================================================================== */}
      {/* 3. BENTO GRID FEATURES (HIGH CONTRAST BLACK/WHITE) */}
      {/* ================================================================================== */}
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

      {/* SEPARATOR GRADIENT */}
      <div className="h-32 bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 w-full"></div>

      {/* ================================================================================== */}
      {/* 4. PRICING SAAS (DIFFERENTIATED BACKGROUND MESH) */}
      {/* ================================================================================== */}
      <section id="pricing" className="py-32 bg-slate-100 dark:bg-slate-900 relative overflow-hidden border-t border-slate-200 dark:border-slate-800">
        {/* Efectos de fondo ÚNICOS para esta sección */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">

          {/* Header Pricing */}
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              Planes Simples
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Inversión Transparente
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Sin tarifas ocultas ni contratos complicados. Comienza gratis y pásate a PRO cuando estés listo para volar.
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* --- PLAN FREE --- */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-300 flex flex-col h-full shadow-lg"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Perfecto para probar la tecnología.</p>
              </div>

              <div className="text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">$0 <span className="text-xl text-slate-400 font-medium">/mes</span></div>

              <ul className="space-y-5 mb-10 flex-1">
                {['5 CVs al mes', 'Análisis de IA Básico', 'Soporte Comunitario'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1"><Check size={12} className="text-slate-600 dark:text-slate-400" /></div> {feat}
                  </li>
                ))}
                {['Sin exportación de datos', 'Sin chat con candidatos', 'Sin comparador'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-400 dark:text-slate-600 text-sm line-through decoration-slate-300 dark:decoration-slate-700">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-800"><X size={12} /></div> {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/register')}
                className="w-full py-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                Crear Cuenta Gratis
              </button>
            </motion.div>

            {/* --- PLAN AGENCY (HERO - GLOWING) --- */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group h-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative bg-slate-900 rounded-[2.2rem] p-10 border border-slate-700 h-full flex flex-col shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-bl from-indigo-600 to-purple-700 text-white text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg">
                    Recomendado
                  </div>
                </div>

                <div className="mb-8 relative z-10">
                  <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
                    Agency <Crown size={24} className="text-yellow-400 fill-yellow-400 animate-bounce-slow" />
                  </h3>
                  <p className="text-indigo-200 text-sm">Poder ilimitado para reclutadores serios.</p>
                </div>

                <div className="flex items-baseline gap-1 mb-8 relative z-10">
                  <span className="text-6xl font-black text-white tracking-tighter">$29</span>
                  <span className="text-slate-400 text-lg">/mes</span>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

                <ul className="space-y-5 mb-10 flex-1 relative z-10">
                  {[
                    'Cargas de PDF Ilimitadas',
                    'Motor Llama 3.3 (70B) Turbo',
                    'Chat con Gemelo Digital (AI Twin)',
                    'Comparador Versus 1vs1',
                    'Exportación de Datos (Excel/CSV)',
                    'Soporte Prioritario WhatsApp'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-sm font-bold">
                      <div className="bg-indigo-500 text-white rounded-full p-1 shadow-lg shadow-indigo-500/50"><Check size={14} strokeWidth={4} /></div> {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/upgrade')}
                  className="w-full py-5 rounded-2xl bg-white text-indigo-950 font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-3 relative z-10 group/btn overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-100 to-transparent -translate-x-full group-hover/btn:animate-shine"></div>
                  <Rocket size={20} className="text-indigo-600" />
                  Obtener Acceso Total
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 5. FAQ (DOT PATTERN BACKGROUND) */}
      {/* ================================================================================== */}
      <section className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors">
        {/* PATRÓN DE PUNTOS */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-100 dark:from-slate-900 to-transparent"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 rounded-full shadow-sm"
            >
              Resolver Dudas
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Frecuentes</span>
            </motion.h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm inline-block rounded-lg px-2">Todo lo que necesitas saber sobre tu nuevo asistente de reclutamiento.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: <BrainCircuit size={20} />,
                q: "¿Qué tan inteligente es realmente VeeBot?",
                a: "VeeBot no usa simples palabras clave. Utilizamos Llama 3.3 (70B), un modelo de lenguaje masivo que entiende el contexto semántico. Sabe que 'React' se relaciona con 'Frontend' y que 'Kubernetes' implica conocimientos de 'DevOps', permitiendo un filtrado humano pero a velocidad máquina."
              },
              {
                icon: <Bot size={20} />,
                q: "¿En qué consiste el 'Gemelo Digital'?",
                a: "Es nuestra función más innovadora. La IA analiza el CV y adopta la personalidad y conocimientos del candidato. Puedes chatear con esta simulación para hacerle preguntas técnicas o situacionales ('¿Cómo resolverías X problema?') antes de agendar una entrevista real."
              },
              {
                icon: <Zap size={20} />,
                q: "¿Cuántos CVs puedo procesar?",
                a: "Con el plan Agency, el cielo es el límite. Nuestra infraestructura en la nube escala automáticamente para procesar desde 10 hasta 10,000 currículums en minutos, manteniendo siempre la máxima velocidad de análisis."
              },
              {
                icon: <Shield size={20} />,
                q: "¿Mis datos son privados?",
                a: "Absolutamente. Tu base de datos de candidatos es un silo aislado y encriptado. No compartimos tus datos con terceros ni los usamos para entrenar modelos públicos. Cumplimos con los estándares de privacidad más estrictos."
              },
              {
                icon: <MessageSquare size={20} />,
                q: "¿Puede VeeBot escribir correos por mí?",
                a: "Sí. El sistema extrae automáticamente el email del candidato y genera borradores hiper-personalizados para invitar a entrevistas o enviar rechazos amables, ahorrándote horas de redacción manual."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10' : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${openFaq === i ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-lg font-bold transition-colors ${openFaq === i ? 'text-indigo-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                      {item.q}
                    </span>
                  </div>
                  <div className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pl-[4.5rem]">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// stack icons with labels
const TechBadge = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-2 group cursor-default">
    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-110 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-all">
      {React.cloneElement(icon, { className: "text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" })}
    </div>
    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{label}</span>
  </div>
);

export default LandingPage;