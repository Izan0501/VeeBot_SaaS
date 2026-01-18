import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle, ArrowRight, BrainCircuit,
  Zap, Code, Menu, X, Database, Cpu, Share2, FileCode, ChevronDown, Lock, FileSpreadsheet, Table, Container
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50, duration: 0.8 }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* ================================================================================== */}
      {/* NAVBAR */}
      {/* ================================================================================== */}
      <Navbar />
      {/* ================================================================================== */}
      {/* 1. HERO SECTION */}
      {/* ================================================================================== */}
      <section className="pt-32 md:pt-48 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03)_0%,_transparent_50%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <motion.div
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Nuevo: Exportación a Excel & Docker Ready</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
            Contrata talento, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500">
              olvida los PDFs.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Transforma montañas de currículums en <strong>datos estructurados, comparables y exportables</strong>.
            El único ATS impulsado por Llama 3.3 que entiende el contexto, no solo palabras clave.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <div className="relative group">
              {/* 1. GLOW TRASERO PULSANTE (Ambiente) */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

              {/* 2. BOTÓN PRINCIPAL */}
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full sm:w-auto px-8 py-4 bg-slate-900 rounded-2xl leading-none flex items-center justify-center gap-3 overflow-hidden"
              >
                {/* 3. FONDO DEGRADADO INTERNO (Sutil) */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* 4. EFECTO DESTELLO (SHINE) AL HOVER */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[25deg] group-hover:animate-shine" />

                {/* 5. CONTENIDO DEL BOTÓN */}
                <span className="relative z-10 font-bold text-lg text-white tracking-wide">
                  Prueba Gratis Ahora
                </span>

                {/* ICONO ANIMADO */}
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                >
                  <ArrowRight size={20} className="text-indigo-200 group-hover:text-white transition-colors" />
                </motion.div>
              </motion.button>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 px-4">
              <span className="flex items-center gap-1"><CheckCircle size={16} className="text-emerald-500" /> Sin tarjeta</span>
              <span className="flex items-center gap-1"><CheckCircle size={16} className="text-emerald-500" /> Docker Friendly</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500 rounded-[2rem] blur opacity-20 animate-pulse"></div>
            <div className="relative rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                </div>
                <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Lock size={8} /> veebot.ai/dashboard
                </div>
              </div>
              {/* MOCKUP UI */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4 hidden md:block">
                  <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-full bg-slate-50 rounded-lg border border-slate-100"></div>)}
                  </div>
                </div>
                <div className="md:col-span-3 space-y-6">
                  <div className="flex justify-between">
                    <div className="h-8 w-48 bg-slate-100 rounded-lg"></div>
                    <div className="h-8 w-24 bg-indigo-100 rounded-lg"></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 w-full bg-white rounded-xl border border-slate-100 shadow-sm flex items-center p-4 gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-slate-100 rounded"></div>
                          <div className="h-3 w-48 bg-slate-50 rounded"></div>
                        </div>
                        <div className="w-16 h-8 bg-green-100 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 right-8 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce-slow">
                <Zap size={16} className="text-yellow-400 fill-yellow-400" /> IA Analizando...
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================================== */}
      {/* 2. DATA INTELLIGENCE */}
      {/* ================================================================================== */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold uppercase mb-4">
                <Table size={14} /> Data Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Del caos del PDF <br />
                <span className="text-emerald-600">al orden del Excel.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Los reclutadores aman Excel, pero odian cargar datos. VeeBot extrae automáticamente nombre, email, skills, experiencia y puntaje de cada CV y te permite <strong>exportar todo a CSV/Excel con un solo clic</strong>.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Extracción automática de datos de contacto.",
                  "Tabla comparativa lado a lado.",
                  "Ordenamiento por Score de relevancia.",
                  "Compatible con ATS externos (Greenhouse, Lever)."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><CheckCircle size={14} /></div>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 hover:underline decoration-2 underline-offset-4 transition-all">
                Ver ejemplo de exportación <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* VISUALIZACIÓN DE TRANSFORMACIÓN */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2 relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-200 p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  {/* Header Fake Table */}
                  <div className="flex gap-4 mb-4 border-b border-slate-200 pb-2 opacity-50">
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                  </div>
                  {/* Rows */}
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="flex items-center gap-4 mb-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">CV</div>
                      <div className="flex-1 h-2 bg-slate-200 rounded animate-pulse"></div>
                      <div className="w-12 h-6 bg-emerald-100 rounded text-emerald-700 text-xs font-bold flex items-center justify-center">9{row}%</div>
                    </div>
                  ))}

                  {/* Floating Export Button */}
                  <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                    <FileSpreadsheet size={24} />
                    <div>
                      <p className="text-xs font-medium opacity-80">Exportar</p>
                      <p className="font-bold">Candidates.csv</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-10 -left-10 w-full h-full bg-slate-200 rounded-3xl -z-10 transform -rotate-2"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 3. BENTO GRID FEATURES */}
      {/* ================================================================================== */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Arquitectura de Próxima Generación</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Construido con tecnología moderna, escalable y fácil de mantener.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* TARJETA GRANDE 1: RAG */}
            <motion.div variants={itemVariants} className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <BrainCircuit size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Motor RAG Vectorial (Llama 3.3)</h3>
                <p className="text-slate-500 max-w-md">
                  A diferencia de los ATS antiguos que buscan palabras clave, VeeBot entiende el <strong>contexto semántico</strong>.
                  Sabe que "React" y "Frontend" están relacionados. Utiliza Pinecone DB para búsquedas vectoriales instantáneas.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-indigo-50 to-transparent opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            </motion.div>

            {/* TARJETA PEQUEÑA 2: DOCKER */}
            <motion.div variants={itemVariants} className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30">
                  <Container size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Dockerized & Ready</h3>
                <p className="text-slate-400 text-sm">
                  Olvídate de configuraciones infernales. Todo el sistema está containerizado con <strong>Docker Compose</strong>.
                  Despliega en AWS, DigitalOcean o tu servidor local en minutos.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 text-blue-900/20 opacity-20 rotate-12 transform group-hover:scale-110 transition-transform">
                <Container size={120} />
              </div>
            </motion.div>

            {/* TARJETA PEQUEÑA 3: FASTAPI */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Python FastAPI</h3>
              <p className="text-slate-500 text-sm">Backend asíncrono de alto rendimiento. Procesa múltiples archivos PDF en paralelo sin bloquear el servidor.</p>
            </motion.div>

            {/* TARJETA GRANDE 4: EMAIL */}
            <motion.div variants={itemVariants} className="md:col-span-2 bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                  <Share2 size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Automatización de Contacto</h3>
                <p className="text-slate-500 max-w-md">
                  Genera plantillas de correo personalizadas y contacta a los candidatos directamente desde la plataforma.
                  El sistema detecta automáticamente los emails dentro de los PDFs.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 4. PRICING */}
      {/* ================================================================================== */}
      <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-white mb-4">Adquiere el Código Fuente</h2>
            <p className="text-slate-400">Una única licencia. Tu propio SaaS. Sin fees mensuales.</p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-full max-w-md relative"
            >
              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative z-10 overflow-hidden group hover:border-indigo-500/50 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-slate-300 mb-2">Licencia SaaS Completa</h3>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-6xl font-black text-white tracking-tighter">$XX</span>
                  </div>
                  <p className="text-slate-500 text-sm mt-4">Pago único. Acceso de por vida.</p>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    "Código Fuente Completo (React + Python)",
                    "Configuración Docker Compose",
                    "Documentación de Despliegue",
                    "Derechos de Reventa (White Label)",
                    "Base de Datos MongoDB Schema",
                    "Integración Pinecone Vector DB"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <CheckCircle size={14} />
                      </div>
                      <span className="text-slate-300 font-medium text-sm">{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
                >
                  Comprar Proyecto <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 5. FAQ */}
      {/* ================================================================================== */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: "¿Es difícil de instalar?", a: "Para nada. Gracias a Docker, solo necesitas correr 'docker-compose up' y el sistema levanta el Frontend, Backend y conecta las bases de datos automáticamente." },
              { q: "¿Qué costo tienen las APIs?", a: "Usamos Llama 3.3 a través de Groq, que es extremadamente económico (y tiene un tier gratuito generoso). Pinecone también tiene un plan gratuito suficiente para empezar." },
              { q: "¿Puedo personalizar el código?", a: "Sí, entregamos el código fuente 100% abierto y limpio. Está estructurado modularmente para que puedas agregar nuevas funciones o cambiar el diseño fácilmente." },
              { q: "¿Cómo funciona la exportación a Excel?", a: "El backend genera un archivo CSV estructurado con todos los campos extraídos por la IA (Nombre, Email, Score, Skills, Resumen) listo para importar en cualquier hoja de cálculo." }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-slate-100 transition-colors"
                >
                  <span className="font-bold text-slate-800">{item.q}</span>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 6. TECH STACK BANNER */}
      {/* ================================================================================== */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 relative overflow-hidden z-20">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Powered by Modern Tech</h2>
            <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <TechBadge icon={<Code />} label="React" />
            <TechBadge icon={<FileCode />} label="FastAPI" />
            <TechBadge icon={<Database />} label="MongoDB" />
            <TechBadge icon={<Share2 />} label="Pinecone" />
            <TechBadge icon={<Cpu />} label="Llama 3.3" />
            <TechBadge icon={<Container />} label="Docker" />
          </div>
        </div>
      </section>
      {/* ================================================================================== */}
      {/* FOOTER */}
      {/* ================================================================================== */}
      <Footer />
    </div>
  );
};

// stack icons with labels
const TechBadge = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-2 group cursor-default">
    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:scale-110 group-hover:border-indigo-200 transition-all">
      {React.cloneElement(icon, { className: "text-slate-600 group-hover:text-indigo-600 transition-colors" })}
    </div>
    <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">{label}</span>
  </div>
);

export default LandingPage;