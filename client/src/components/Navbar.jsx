import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, BrainCircuit } from 'lucide-react';

const Navbar = () => {
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

  return (
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
            <Link to="/faq" className="text-lg font-medium text-slate-700 p-4 hover:bg-white/60 rounded-2xl transition-colors flex justify-between items-center group">FAQ<ArrowRight size={16} className="text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></Link>
            <div className="h-px bg-slate-900/10 my-2"></div>
            <button onClick={() => handleNavigation('/login')} className="w-full py-3.5 text-center font-bold text-slate-700 border border-slate-300/50 rounded-xl hover:bg-white/50 transition-colors">Iniciar Sesión</button>
            <button onClick={() => handleNavigation('/register')} className="w-full py-3.5 text-center font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors active:scale-95">Empezar Gratis</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;