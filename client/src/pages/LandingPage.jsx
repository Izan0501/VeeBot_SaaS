import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, ArrowRight, UploadCloud, BrainCircuit, ShieldCheck,
  Zap, Layout, Users, Code, Menu, X, Server, Database, Cpu, Share2, FileCode, ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- FUNCIÓN DE SCROLL PROFESIONAL ---
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Cerramos menú móvil si está abierto

    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  // Función para navegar y cerrar menú
  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* --- NAVBAR FLOTANTE --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
          >
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">VeeBot AI</span>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer relative group">
              Características
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer relative group">
              Planes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">Login</button>
            <button onClick={() => navigate('/register')} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-300">
              Empezar Gratis
            </button>
          </div>

          {/* BOTÓN BURGER */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* --- MENÚ MÓVIL DESPLEGABLE CON ANIMACIONES EN CASCADA --- */}
        <div className={`md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}>
          <div className="flex flex-col p-6 space-y-4">

            {/* Link 1 (Características) */}
            <a
              href="#features"
              onClick={(e) => handleScroll(e, 'features')}
              className={`text-lg font-medium text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100 transition-all duration-500 delay-100 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
            >
              Características
            </a>

            {/* Link 2 (Precios) */}
            <a
              href="#pricing"
              onClick={(e) => handleScroll(e, 'pricing')}
              className={`text-lg font-medium text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100 transition-all duration-500 delay-200 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
            >
              Planes
            </a>

            {/* Botones */}
            <div className={`flex flex-col gap-3 pt-2 transition-all duration-500 delay-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
              <button
                onClick={() => handleNavigation('/login')}
                className="w-full py-3 text-center font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => handleNavigation('/register')}
                className="w-full py-3 text-center font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              >
                Empezar Gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Potenciado por Llama 3.3 & Groq
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
            Reclutamiento inteligente <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
              con precisión quirúrgica.
            </span>
          </h1>

          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Deja que nuestra IA lea miles de CVs por ti. Filtra, califica y encuentra al candidato perfecto en segundos usando tecnología RAG avanzada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:translate-y-0">
              Probar Demo Gratis <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 group-hover:scale-110 transition-transform">▶</span>
              Ver Video Demo
            </button>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-slate-50/50 p-2 shadow-2xl backdrop-blur-sm lg:rounded-3xl hover:shadow-indigo-500/10 transition-shadow duration-500">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner relative">
              <div className="bg-slate-900 h-8 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-slate-50">
                <BrainCircuit size={64} className="text-indigo-200 mb-4" />
                <p className="text-slate-400 font-medium">Vista previa del Dashboard Inteligente</p>
                <p className="text-slate-300 text-sm">(Captura de pantalla de la app real)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Tecnología utilizada por equipos modernos</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['ACME Corp', 'Globex', 'Soylent', 'Initech', 'Massive Dynamic'].map(c => (
              <div key={c} className="text-2xl font-bold font-serif cursor-default hover:text-slate-900 transition-colors">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Todo lo que necesitas para contratar mejor</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Nuestra suite de herramientas elimina el trabajo manual y el sesgo cognitivo del proceso de selección.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<UploadCloud className="text-indigo-600 group-hover:text-white transition-colors" size={28} />}
              title="Carga Masiva & Parsing"
              desc="Sube carpetas enteras de PDFs. Nuestro motor extrae texto, habilidades y experiencia estructurada en milisegundos."
            />
            <FeatureCard
              icon={<BrainCircuit className="text-purple-600 group-hover:text-white transition-colors" size={28} />}
              title="Análisis Semántico RAG"
              desc="No buscamos palabras clave. Entendemos el contexto real del CV comparándolo vectorialmente con tu búsqueda."
            />
            <FeatureCard
              icon={<Zap className="text-yellow-500 group-hover:text-white transition-colors" size={28} />}
              title="Auto-Rechazo Inteligente"
              desc="Configura umbrales de score. Si un candidato no cumple con el mínimo técnico, la IA lo filtra automáticamente."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-teal-600 group-hover:text-white transition-colors" size={28} />}
              title="Privacidad y Seguridad"
              desc="Tus datos están encriptados. Cumplimos con estándares modernos de protección de datos personales."
            />
            <FeatureCard
              icon={<Layout className="text-blue-500 group-hover:text-white transition-colors" size={28} />}
              title="Dashboard Intuitivo"
              desc="Visualiza métricas, compara candidatos lado a lado y chatea con la IA para tomar decisiones informadas."
            />
            <FeatureCard
              icon={<Code className="text-pink-500 group-hover:text-white transition-colors" size={28} />}
              title="Exportación Flexible"
              desc="Lleva los datos de tus mejores candidatos a tu ATS favorito o expórtalos en formato JSON/CSV."
            />
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Planes simples y transparentes</h2>
            <p className="text-lg text-slate-500">Comienza gratis y escala según tus necesidades de contratación.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Starter"
              price="$0"
              period="/mes"
              onClick={() => navigate('/register')}
              features={['50 CVs por mes', 'Análisis básico IA', '1 Usuario', 'Soporte por email']}
            />

            <div className="relative bg-white p-8 rounded-2xl border-2 border-indigo-600 shadow-2xl scale-105 z-10 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">MÁS POPULAR</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Profesional</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$49</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">Para reclutadores y agencias pequeñas.</p>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/30 mb-8 active:scale-95"
              >
                Comenzar Prueba
              </button>
              <ul className="space-y-4">
                {['500 CVs por mes', 'Motor Llama 3.3 (70B)', 'Chat RAG Ilimitado', 'Auto-Rechazo Configurable', 'Exportación de Datos'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle size={18} className="text-indigo-600 flex-shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <PricingCard
              title="Agencia"
              price="$199"
              period="/mes"
              onClick={() => navigate('/register')}
              features={['CVs Ilimitados', 'API Access', 'Marca Blanca (White-label)', 'Soporte Prioritario 24/7']}
            />
          </div>
        </div>
      </section>

      {/* --- TECH STACK BANNER PRO --- */}
      <section className="py-16 bg-slate-950 border-t border-slate-800 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                Built with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Next-Gen Stack</span>
              </h2>
              <p className="text-slate-400 max-w-lg">
                Código limpio, escalable y listo para producción. Dockerizado y optimizado para la nube.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              System Operational
            </div>
          </div>

          {/* Tech Grid (5 Columnas) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <TechCard
              icon={<Code className="text-blue-400" />}
              title="React + Vite"
              desc="Frontend Ultra Rápido"
              color="hover:border-blue-500/50 hover:shadow-blue-500/20"
            />
            <TechCard
              icon={<FileCode className="text-emerald-400" />}
              title="Python + FastAPI"
              desc="Backend Asíncrono"
              color="hover:border-emerald-500/50 hover:shadow-emerald-500/20"
            />
            <TechCard
              icon={<Database className="text-green-500" />}
              title="MongoDB Atlas"
              desc="Datos & Usuarios"
              color="hover:border-green-500/50 hover:shadow-green-500/20"
            />
            <TechCard
              icon={<Share2 className="text-yellow-400" />}
              title="Pinecone DB"
              desc="Memoria Vectorial"
              color="hover:border-yellow-500/50 hover:shadow-yellow-500/20"
            />
            <TechCard
              icon={<Cpu className="text-purple-400" />}
              title="Llama 3.3"
              desc="Motor IA Groq LPU"
              color="hover:border-purple-500/50 hover:shadow-purple-500/20"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group duration-300 hover:-translate-y-1">
    <div className="mb-4 p-3 bg-slate-50 rounded-xl inline-block group-hover:bg-indigo-600 transition-colors duration-300">
      {/* Icono que se vuelve blanco al hacer hover en la tarjeta */}
      {React.cloneElement(icon, { className: `${icon.props.className} group-hover:text-white` })}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const PricingCard = ({ title, price, period, features, onClick }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-extrabold text-slate-900">{price}</span>
      <span className="text-slate-500">{period}</span>
    </div>
    <button
      onClick={onClick}
      className="w-full py-3 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold transition-all mb-8 active:scale-95"
    >
      Elegir Plan
    </button>
    <ul className="space-y-4">
      {features.map((feat, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
          <CheckCircle size={18} className="text-slate-300 flex-shrink-0" /> {feat}
        </li>
      ))}
    </ul>
  </div>
);

const TechCard = ({ icon, title, desc, color }) => (
    <div className={`bg-slate-900/50 border border-slate-800 p-6 rounded-xl transition-all duration-300 group hover:-translate-y-1 ${color}`}>
        <div className="mb-4 p-3 bg-slate-950 rounded-lg inline-block shadow-inner border border-slate-800">
            {icon}
        </div>
        <h4 className="text-white font-bold text-lg mb-1 group-hover:text-white transition-colors">{title}</h4>
        <p className="text-slate-500 text-sm">{desc}</p>
    </div>
);

export default LandingPage;