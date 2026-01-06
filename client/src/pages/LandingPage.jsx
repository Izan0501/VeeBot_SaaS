import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, ArrowRight, UploadCloud, BrainCircuit, ShieldCheck,
  Zap, Layout, Users, Code, Menu, X, Database, Cpu, Share2, FileCode
} from 'lucide-react';

// --- COMPONENTE DE ANIMACIÓN (REVEAL PROFESIONAL) ---
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`will-change-transform transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform ${isVisible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-24 blur-sm"
        } ${className}`}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">VeeBot AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Características</a>
            <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Planes</a>
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-900 hover:text-indigo-600">Login</button>
            <button onClick={() => navigate('/register')} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20">
              Empezar Gratis
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'} origin-top`}>
          <div className="flex flex-col p-6 space-y-4">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-lg font-medium text-slate-700 py-2 border-b border-slate-100">Características</a>
            <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="text-lg font-medium text-slate-700 py-2 border-b border-slate-100">Planes</a>
            <button onClick={() => handleNavigation('/login')} className="w-full py-3 font-bold border rounded-xl">Iniciar Sesión</button>
            <button onClick={() => handleNavigation('/register')} className="w-full py-3 font-bold text-white bg-indigo-600 rounded-xl">Empezar Gratis</button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="max-w-5xl mx-auto text-center">
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Potenciado por Llama 3.3 & Groq
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
              Reclutamiento inteligente <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
                con precisión quirúrgica.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              VeeBot lee miles de CVs por ti. Filtra, califica y encuentra al candidato perfecto en segundos usando tecnología RAG avanzada.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                Probar Demo Gratis <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 group">
                <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 group-hover:scale-110 transition-transform">▶</span>
                Ver Video Demo
              </button>
            </div>
          </Reveal>

          {/* DASHBOARD PREVIEW */}
          <Reveal delay={600}>
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-slate-50/50 p-2 shadow-2xl backdrop-blur-sm lg:rounded-3xl hover:shadow-indigo-500/10 transition-shadow duration-500">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner relative group cursor-pointer">
                {/* Overlay al hacer hover para simular interactividad */}
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
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <Reveal>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Tecnología utilizada por equipos modernos</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {['ACME Corp', 'Globex', 'Soylent', 'Massive Dynamic', 'Umbrella'].map(c => (
                <div key={c} className="text-2xl font-bold font-serif cursor-default hover:text-slate-900 transition-colors">{c}</div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Todo lo que necesitas para contratar mejor</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Elimina el trabajo manual y el sesgo cognitivo del proceso.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <UploadCloud size={28} />, title: "Carga Masiva", desc: "Sube carpetas enteras. Nuestro motor extrae texto y skills en milisegundos.", color: "text-indigo-600" },
              { icon: <BrainCircuit size={28} />, title: "Análisis RAG", desc: "Entendemos el contexto real del CV comparándolo vectorialmente.", color: "text-purple-600" },
              { icon: <Zap size={28} />, title: "Auto-Rechazo", desc: "Configura umbrales. Si no cumple el mínimo técnico, la IA lo filtra.", color: "text-yellow-500" },
              { icon: <ShieldCheck size={28} />, title: "Seguridad Total", desc: "Datos encriptados. Cumplimos con estándares de privacidad.", color: "text-teal-600" },
              { icon: <Layout size={28} />, title: "Dashboard", desc: "Compara candidatos lado a lado y chatea con la IA para decidir.", color: "text-blue-500" },
              { icon: <Code size={28} />, title: "Exportación", desc: "Lleva los datos a tu ATS favorito o expórtalos en JSON/CSV.", color: "text-pink-500" }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 100}>
                <FeatureCard {...feature} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING (SOLO $29 - PLAN ÚNICO Y DECORADO) --- */}
      <section id="pricing" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Un Plan, Acceso Total</h2>
              <p className="text-lg text-slate-500">Sin límites ocultos. Todo lo que necesitas para reclutar mejor.</p>
            </div>
          </Reveal>

          <div className="flex justify-center max-w-4xl mx-auto">
            {/* PLAN AGENCY (EL ÚNICO DISPONIBLE) */}
            <Reveal delay={200} className="w-full max-w-lg">
              <div className="relative bg-white p-10 rounded-3xl border-2 border-indigo-600 shadow-2xl z-10 transform transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl">ACCESO INMEDIATO</div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">VeeBot Agency</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-6xl font-extrabold text-slate-900">$29</span>
                    <span className="text-slate-500 text-xl">/mes</span>
                  </div>
                  <p className="text-slate-500">Cancela cuando quieras.</p>
                </div>

                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-5 bg-indigo-600 text-white text-lg rounded-xl font-bold hover:bg-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-500/30 mb-10 active:scale-95 flex items-center justify-center gap-2"
                >
                  Obtener Acceso Total <ArrowRight size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['CVs Ilimitados', 'Motor Llama 3.3 (70B)', 'Chat RAG Inteligente', 'Envío de Reportes Email', 'Soporte Prioritario', 'Panel de Analíticas', 'Exportación de Datos', 'Actualizaciones Futuras'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium list-none">
                      <CheckCircle size={18} className="text-indigo-600 flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- TECH STACK BANNER --- */}
      <section className="py-16 bg-slate-950 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Built with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Next-Gen Stack</span></h2>
                <p className="text-slate-400 max-w-lg">Código limpio, escalable y listo para producción.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> System Operational
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: <Code className="text-blue-400" />, title: "React + Vite", desc: "Frontend" },
              { icon: <FileCode className="text-emerald-400" />, title: "Python FastAPI", desc: "Backend" },
              { icon: <Database className="text-green-500" />, title: "MongoDB Atlas", desc: "Database" },
              { icon: <Share2 className="text-yellow-400" />, title: "Pinecone DB", desc: "Vectores" },
              { icon: <Cpu className="text-purple-400" />, title: "Llama 3.3", desc: "Groq LPU" }
            ].map((tech, i) => (
              <Reveal key={i} delay={i * 100}>
                <TechCard {...tech} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white text-slate-500 py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1.5 rounded-lg"><BrainCircuit className="text-slate-900" size={20} /></div>
            <span className="text-slate-900 font-bold text-lg">VeeBot AI</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">Términos</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contacto</a>
          </div>
          <p className="text-sm">© 2024 VeeBot Inc.</p>
        </div>
      </footer>
    </div>
  );
};

// Componentes Auxiliares
const FeatureCard = ({ icon, title, desc, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group duration-300 hover:-translate-y-1 h-full">
    <div className={`mb-4 p-3 bg-slate-50 rounded-xl inline-block group-hover:bg-indigo-600 transition-colors duration-300 ${color} group-hover:text-white`}>
      {React.cloneElement(icon, { className: "current-color" })}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

// NOTA: PricingCard ya no se usa porque la card de $29 está integrada directamente en el componente LandingPage para máximo control de diseño.

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