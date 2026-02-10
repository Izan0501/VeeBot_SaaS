import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ArrowUpRight, Github, Twitter, Linkedin, Heart, Mail } from 'lucide-react';

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const footerLinks = [
    { to: "/terms", label: "Términos" },
    { to: "/privacy", label: "Privacidad" },
    { to: "/contact", label: "Contacto" },
    { to: "/faq", label: "FAQ" }
  ];

  const socialLinks = [
    { icon: <Mail size={18} />, href: "#" }
  ];

  return (
    <footer className="relative pt-32 pb-10 overflow-hidden z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">

      {/* ==================== 1. FONDO ATMOSFÉRICO (VIVO) ==================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/50 dark:to-slate-900/50"></div>

        {/* Orbes Animados (Movimiento aleatorio suave) */}
        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[30%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] right-[20%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      {/* Línea de Borde Brillante Superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-indigo-400/30 to-transparent"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">

          {/* ==================== COLUMNA 1: LOGO & MISIÓN (4 cols) ==================== */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <BrainCircuit className="text-indigo-600 dark:text-indigo-400" size={26} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">VeeBot AI</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Recruiting OS</span>
              </div>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Infraestructura de inteligencia artificial para equipos de recursos humanos modernos.
            </p>
          </div>

          {/* ==================== COLUMNA 2: NAVEGACIÓN MAGNÉTICA (4 cols) ==================== */}
          <div className="md:col-span-4 flex justify-center">
            <div className="flex flex-wrap justify-center gap-1 p-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-300/50 dark:border-slate-700/50 shadow-inner"
              onMouseLeave={() => setHoveredLink(null)}>

              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onMouseEnter={() => setHoveredLink(link.to)}
                  className="relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 z-10"
                >
                  <span className={`relative z-20 ${hoveredLink === link.to ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
                    {link.label}
                  </span>

                  {/* EL EFECTO "ORGÁSMICO" DE FONDO DESLIZANTE */}
                  {hoveredLink === link.to && (
                    <motion.div
                      layoutId="footer-pill"
                      className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-sm z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* ==================== COLUMNA 3:STATUS (4 cols) ==================== */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end gap-6">
            {/* Status Badge Pulse*/}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                VeeBot AI - Online
              </span>
            </div>
          </div>
        </div>

        {/* ==================== FOOTER BOTTOM ==================== */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-center items-center gap-4 text-center md:text-left">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} VeeBot Inc. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;