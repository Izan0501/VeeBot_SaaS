import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Mail } from 'lucide-react';

const footerLinks = [
  { to: "/terms", label: "Términos" },
  { to: "/privacy", label: "Privacidad" },
  { to: "/contact", label: "Contacto" },
  { to: "/faq", label: "FAQ" },
];

const socialLinks = [
  { icon: <Mail size={18} />, href: "#" }
];

const Footer = () => {
  const [hoverStyle, setHoverStyle] = useState({ opacity: 0, left: 0, top: 0, width: 0, height: 0 });

  return (
    <footer className="relative pt-32 pb-10 overflow-hidden z-10 bg-neutral-50 dark:bg-zinc-950 border-t border-neutral-200 dark:border-white/5 transition-colors duration-500">

      {/* ==================== 1. FONDO ATMOSFÉRICO (VIVO) ==================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/50 dark:to-slate-900/50"></div>

        {/* Orbes Animados (Movimiento aleatorio suave) */}
        <m.div
          animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[30%] left-[20%] size-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
        />
        <m.div
          animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] right-[20%] size-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      {/* Línea de Borde Brillante Superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 dark:via-indigo-400/30 to-transparent"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">

          {/* ==================== COLUMNA 1: LOGO & MISIÓN (4 cols) ==================== */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-y-4">
            <div className="flex items-start">
              <Link
                to="/"
                className="relative flex items-center justify-center w-14 h-14 shrink-0 ml-2"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Axon Crafts Home"
              >
                <img src="/Favicon.png" alt="Axon Crafts" className="animate-logo-core h-11 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Infraestructura de inteligencia artificial para equipos de recursos humanos modernos.
            </p>
          </div>

          {/* ==================== COLUMNA 2: NAVEGACIÓN LÍQUIDA (4 cols) ==================== */}
          <div className="md:col-span-4 flex justify-center">
            <div 
              className="relative flex flex-wrap justify-center gap-2"
              onMouseLeave={() => setHoverStyle((prev) => ({ ...prev, opacity: 0 }))}
            >
              {/* OMNIDIRECTIONAL LIQUID GLASS PILL */}
              <div 
                className="absolute bg-indigo-500/5 dark:bg-indigo-500/20 border border-indigo-500/10 dark:border-indigo-400/40 shadow-[inset_0_1px_4px_rgba(255,255,255,0.3),0_4px_12px_rgba(99,102,241,0.1)] dark:shadow-[inset_0_1px_4px_rgba(255,255,255,0.15),0_4px_12px_rgba(99,102,241,0.3)] backdrop-blur-xl rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none z-0"
                style={{
                  opacity: hoverStyle.opacity,
                  left: `${hoverStyle.left}px`,
                  top: `${hoverStyle.top}px`,
                  width: `${hoverStyle.width}px`,
                  height: `${hoverStyle.height}px`,
                }}
              />

              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onMouseEnter={(e) => {
                    setHoverStyle({
                      opacity: 1,
                      left: e.currentTarget.offsetLeft,
                      top: e.currentTarget.offsetTop,
                      width: e.currentTarget.offsetWidth,
                      height: e.currentTarget.offsetHeight,
                    });
                  }}
                  className="relative z-10 block px-4 py-2 transition-colors duration-300 text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-full"
                >
                  <span className="relative z-20">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ==================== COLUMNA 3:STATUS (4 cols) ==================== */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end gap-6">
            {/* Status Badge Pulse*/}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
              <div className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                VeeBot AI - Online
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-center items-center gap-4 text-center md:text-left">
          <p suppressHydrationWarning className="text-sm font-medium text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} VeeBot Inc. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;