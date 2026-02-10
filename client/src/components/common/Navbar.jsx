import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Zap, ChevronRight, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null); // Estado para la navegación líquida

  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Detectar scroll con precisión
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = isScrolled;
    const current = latest > 20;
    if (previous !== current) setIsScrolled(current);
  });

  // Cerrar menú al cambiar de ruta
  useEffect(() => { setIsOpen(false); }, [location]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const navLinks = [
    { name: 'Features', path: '#features' },
    { name: 'Pricing', path: '#pricing' },
    { name: 'FAQ´s', path: '#FAQ' },
  ];

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- ANIMATION VARIANTS ---
  const mobileMenuVariants = {
    closed: { opacity: 0, scaleY: 0.95, y: -20, filter: "blur(10px)" },
    open: {
      opacity: 1, scaleY: 1, y: 0, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 300, damping: 30, staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isOpen
            ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60'
            : 'bg-transparent'
          }`}
      >
        {/* BORDE LÁSER DE PROFUNDIDAD (Solo visible al hacer scroll) */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">

          {/* ================= LOGO CON MICRO-INTERACCIÓN ================= */}
          <Link
            to="/"
            className="flex items-center gap-2 group z-50 relative"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="w-10 h-10 relative bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <Zap size={20} fill="currentColor" className="group-hover:animate-pulse" />
              </div>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-900 dark:group-hover:text-indigo-200 transition-colors">
              VeeBot<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
            </span>
          </Link>

          {/* ================= DESKTOP MENU (NAVEGACIÓN LÍQUIDA) ================= */}
          <div className="hidden md:flex items-center gap-2" onMouseLeave={() => setHoveredLink(null)}>
            {/* Pill Container */}
            <div className="flex items-center bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleScrollTo(e, link.path)}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  className="relative px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 z-10"
                >
                  {/* Texto del Link */}
                  <span className={`relative z-20 transition-colors duration-200 ${hoveredLink === link.name ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
                    {link.name}
                  </span>

                  {/* EL PILL (FONDO MÓVIL) */}
                  {hoveredLink === link.name && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-4"></div>

            {/* Acciones */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="group relative px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-bold rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%_auto] animate-gradient-x"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          {/* ================= MOBILE TOGGLE BUTTON (MORPHING) ================= */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent active:border-slate-300 dark:active:border-slate-600"
            aria-label="Toggle Menu"
          >
            <motion.div
              animate={isOpen ? "open" : "closed"}
              className="w-5 h-4 flex flex-col justify-between"
            >
              <motion.span
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-0.5 bg-current rounded-full origin-center"
              />
              <motion.span
                variants={{ closed: { opacity: 1, scale: 1 }, open: { opacity: 0, scale: 0 } }}
                transition={{ duration: 0.1 }}
                className="w-full h-0.5 bg-current rounded-full"
              />
              <motion.span
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-0.5 bg-current rounded-full origin-center"
              />
            </motion.div>
          </button>
        </div>
      </motion.nav>

      {/* ================= MOBILE MENU (PHYSICS DRIVEN) ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed top-20 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl border-b border-slate-200 dark:border-slate-800 shadow-2xl origin-top overflow-hidden md:hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  variants={itemVariants}
                  href={link.path}
                  onClick={(e) => handleScrollTo(e, link.path)}
                  className="p-4 rounded-2xl text-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-between group"
                >
                  {link.name}
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-500" />
                </motion.a>
              ))}

              <motion.div variants={itemVariants} className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-4" />

              <motion.div variants={itemVariants} className="flex flex-col gap-3 p-2">
                <Link
                  to="/login"
                  className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-center shadow-lg shadow-indigo-500/25 active:scale-95 transition-transform relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10">Get Started Free</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKDROP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-20 z-30 bg-black/20 dark:bg-black/50 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;