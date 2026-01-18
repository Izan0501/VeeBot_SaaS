import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative pt-24 pb-10 overflow-hidden z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-50 z-0"></div>

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
              {[{ to: "/terms", label: "Términos" }, { to: "/privacy", label: "Privacidad" }, { to: "/contact", label: "Contacto" }, { to: "/faq", label: "FAQ" }].map((link) => (
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
  );
};

export default Footer;