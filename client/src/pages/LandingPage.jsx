import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle, ArrowRight, UploadCloud, BrainCircuit, ShieldCheck,
  Zap, Layout, Code, Menu, X, Database, Cpu, Share2, FileCode, Star
} from 'lucide-react';
import { motion } from 'framer-motion'; // <--- IMPORTANTE

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // --- VARIANTES DE ANIMACIÓN (FRAMER MOTION) ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* --- NAVBAR CRYSTAL PINK (INTACTO) --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out border-b 
        ${isScrolled
            ? "border-white/40 py-3"
            : "bg-transparent border-transparent py-5"
          }`}
      >
        <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-all duration-700 ease-out ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-white/70 md:bg-white/30 backdrop-blur-2xl"></div>
          <div className="absolute -top-[100px] right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-rose-500/5 md:bg-rose-500/20 rounded-full blur-[60px] md:blur-[80px] mix-blend-multiply animate-pulse"></div>
          <div className="absolute -top-[100px] left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-indigo-500/5 md:bg-indigo-500/20 rounded-full blur-[60px] md:blur-[80px] mix-blend-multiply"></div>
          <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/5 md:bg-purple-500/10 rounded-full blur-[60px] mix-blend-multiply"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent shadow-[0_0_10px_white]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative overflow-hidden bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-[-150%] transition-transform duration-700 ease-in-out skew-y-12"></div>
              <BrainCircuit className="text-white relative z-10" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">VeeBot AI</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {['Características', 'Planes'].map((item) => (
              <a key={item} href={item === 'Características' ? '#features' : '#pricing'} onClick={(e) => handleScroll(e, item === 'Características' ? 'features' : 'pricing')} className="relative px-5 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors group overflow-hidden rounded-full">
                <span className="relative z-10">{item}</span>
                <span className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full border border-white/60"></span>
              </a>
            ))}
            <div className="w-px h-6 bg-slate-900/10 mx-4"></div>
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-5 py-2 transition-colors">Login</button>
            <button onClick={() => navigate('/register')} className="relative group bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">Empezar Gratis <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2.5 text-slate-600 hover:bg-white/50 rounded-xl transition-colors active:scale-95 border border-transparent hover:border-white/50">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/70 backdrop-blur-3xl border-b border-white/50 shadow-xl p-6 relative">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-rose-100/30 to-indigo-100/30 pointer-events-none z-0"></div>
            <div className="flex flex-col space-y-2 relative z-10">
              <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-lg font-medium text-slate-700 p-4 hover:bg-white/60 rounded-2xl transition-colors flex justify-between items-center group">Características <ArrowRight size={16} className="text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></a>
              <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="text-lg font-medium text-slate-700 p-4 hover:bg-white/60 rounded-2xl transition-colors flex justify-between items-center group">Planes <ArrowRight size={16} className="text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></a>
              <Link to="/terms" className="text-lg font-medium text-slate-700 p-4 hover:bg-white/60 rounded-2xl transition-colors flex justify-between items-center group">Términos <ArrowRight size={16} className="text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></Link>
              <div className="h-px bg-slate-900/10 my-2"></div>
              <button onClick={() => handleNavigation('/login')} className="w-full py-3.5 text-center font-bold text-slate-700 border border-slate-300/50 rounded-xl hover:bg-white/50 transition-colors">Iniciar Sesión</button>
              <button onClick={() => handleNavigation('/register')} className="w-full py-3.5 text-center font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors active:scale-95">Empezar Gratis</button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (ANIMACIONES FRESCAS) --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Orbe de fondo con animación */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10"
        />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Potenciado por Llama 3.3 & Groq
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight"
          >
            Reclutamiento inteligente <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
              con precisión quirúrgica.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            VeeBot lee miles de CVs por ti. Filtra, califica y encuentra al candidato perfecto en segundos usando tecnología RAG avanzada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-95">
              Probar Demo Gratis <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 group-hover:scale-110 transition-transform">▶</span>
              Ver Video Demo
            </button>
          </motion.div>

          {/* DASHBOARD PREVIEW (Tilt Effect Sutil) */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-slate-50/50 p-2 shadow-2xl backdrop-blur-sm lg:rounded-3xl hover:shadow-indigo-500/10 transition-shadow duration-500"
          >
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner relative group cursor-pointer">
              <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/5 transition-colors duration-500 z-10"></div>
              <div className="bg-slate-900 h-8 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-12 flex flex-col items-center justify-center min-h-[400px] bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center animate-bounce-slow">
                  <BrainCircuit size={64} className="text-indigo-600 mb-4" />
                  <p className="text-slate-900 font-bold text-lg">Dashboard Inteligente</p>
                  <p className="text-slate-500 text-sm">Arrastra tus PDFs aquí</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SOCIAL PROOF (MARQUEE) --- */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Tecnología utilizada por equipos modernos</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['ACME Corp', 'Globex', 'Soylent', 'Massive Dynamic', 'Umbrella'].map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-2xl font-bold font-serif cursor-default hover:text-slate-900 transition-colors"
              >
                {c}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID (STAGGERED) --- */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Todo lo que necesitas para contratar mejor</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Elimina el trabajo manual y el sesgo cognitivo del proceso.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: <UploadCloud size={28} />, title: "Carga Masiva", desc: "Sube carpetas enteras. Nuestro motor extrae texto y skills en milisegundos.", color: "text-indigo-600" },
              { icon: <BrainCircuit size={28} />, title: "Análisis RAG", desc: "Entendemos el contexto real del CV comparándolo vectorialmente.", color: "text-purple-600" },
              { icon: <Zap size={28} />, title: "Auto-Rechazo", desc: "Configura umbrales. Si no cumple el mínimo técnico, la IA lo filtra.", color: "text-yellow-500" },
              { icon: <ShieldCheck size={28} />, title: "Seguridad Total", desc: "Datos encriptados. Cumplimos con estándares de privacidad.", color: "text-teal-600" },
              { icon: <Layout size={28} />, title: "Dashboard", desc: "Compara candidatos lado a lado y chatea con la IA para decidir.", color: "text-blue-500" },
              { icon: <Code size={28} />, title: "Exportación", desc: "Lleva los datos a tu ATS favorito o expórtalos en JSON/CSV.", color: "text-pink-500" }
            ].map((feature, i) => (
              <motion.div key={i} variants={cardVariant}>
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- PRICING (PLAN ÚNICO LEVITANDO) --- */}
      <section id="pricing" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Un Plan, Acceso Total</h2>
            <p className="text-lg text-slate-500">Sin límites ocultos. Todo lo que necesitas para reclutar mejor.</p>
          </motion.div>

          <div className="flex justify-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-full max-w-lg"
            >
              <div className="relative bg-white p-10 rounded-3xl border-2 border-indigo-600 shadow-2xl z-10 transform hover:scale-[1.01] transition-transform duration-300 group">
                {/* Glow detrás de la card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl relative z-20">ACCESO INMEDIATO</div>

                <div className="relative z-20 text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">VeeBot Agency</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-6xl font-extrabold text-slate-900">$29</span>
                    <span className="text-slate-500 text-xl">/mes</span>
                  </div>
                  <p className="text-slate-500">Cancela cuando quieras.</p>
                </div>

                <button
                  onClick={() => navigate('/register')}
                  className="relative z-20 w-full py-5 bg-indigo-600 text-white text-lg rounded-xl font-bold hover:bg-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-500/30 mb-10 active:scale-95 flex items-center justify-center gap-2"
                >
                  Obtener Acceso Total <ArrowRight size={20} />
                </button>

                <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['CVs Ilimitados', 'Motor Llama 3.3 (70B)', 'Chat RAG Inteligente', 'Envío de Reportes Email', 'Soporte Prioritario', 'Panel de Analíticas', 'Exportación de Datos', 'Actualizaciones Futuras'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium list-none">
                      <CheckCircle size={18} className="text-indigo-600 flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TECH STACK BANNER --- */}
      <section className="py-16 bg-slate-950 border-t border-slate-800 relative overflow-hidden z-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left"
          >
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Built with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Next-Gen Stack</span></h2>
              <p className="text-slate-400 max-w-lg">Código limpio, escalable y listo para producción.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> System Operational
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {[
              { icon: <Code className="text-blue-400" />, title: "React + Vite", desc: "Frontend" },
              { icon: <FileCode className="text-emerald-400" />, title: "Python FastAPI", desc: "Backend" },
              { icon: <Database className="text-green-500" />, title: "MongoDB Atlas", desc: "Database" },
              { icon: <Share2 className="text-yellow-400" />, title: "Pinecone DB", desc: "Vectores" },
              { icon: <Cpu className="text-purple-400" />, title: "Llama 3.3", desc: "Groq LPU" }
            ].map((tech, i) => (
              <motion.div key={i} variants={cardVariant}>
                <TechCard {...tech} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER CRYSTAL GLASS (INTACTO + ANIMACIÓN SUTIL DE ORBES) --- */}
      <footer className="relative pt-24 pb-10 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-50 z-0"></div>

        {/* Orbes con movimiento muy lento (Floating) */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[300px] left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[200px] right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></motion.div>
        <div className="absolute bottom-[-200px] left-1/3 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-10 shadow-[0_-20px_40px_rgba(255,255,255,0.8)]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-20"></div>

        <div className="relative z-30 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 items-center">
            <div className="flex flex-col items-center md:items-start gap-4 order-2 md:order-1">
              <div className="flex items-center gap-3 group cursor-default">
                <div className="relative overflow-hidden bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
                  <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-[-150%] transition-transform duration-700 ease-in-out skew-y-12"></div>
                  <BrainCircuit className="text-white relative z-10" size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-900 transition-colors">VeeBot AI</span>
              </div>
              <p className="text-sm text-slate-500/80 font-medium text-center md:text-left max-w-[250px] leading-relaxed hidden md:block">Infraestructura de reclutamiento inteligente.</p>
            </div>

            <div className="flex justify-center order-1 md:order-2">
              <div className="flex flex-wrap justify-center gap-1 px-2 py-2 rounded-full bg-white/40 border border-white/60 backdrop-blur-md shadow-sm">
                {[{ to: "/terms", label: "Términos" }, { to: "/privacy", label: "Privacidad" }, { to: "/contact", label: "Contacto" }].map((link) => (
                  <Link key={link.to} to={link.to} className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white/80 transition-all duration-300">{link.label}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 order-3">
              <p className="text-sm font-bold text-slate-500">© {new Date().getFullYear()} VeeBot Inc.</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold bg-white/60 border border-white px-3 py-1 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Systems Online
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-900/5 text-center">
            <p className="text-xs font-medium text-slate-400 hover:text-indigo-500 transition-colors cursor-default">Designed in Tucumán-Argentina 🧉</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---
const FeatureCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group duration-300 hover:-translate-y-1 h-full">
    <div className={`mb-4 p-3 bg-slate-50 rounded-xl inline-block group-hover:bg-indigo-600 transition-colors duration-300 ${color} group-hover:text-white`}>
      {React.cloneElement(icon, { className: "current-color" })}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const TechCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl transition-all duration-300 group hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-500/10">
    <div className="mb-4 p-3 bg-slate-950 rounded-lg inline-block shadow-inner border border-slate-800">
      {icon}
    </div>
    <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
);

export default LandingPage;