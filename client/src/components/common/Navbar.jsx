import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronRight, Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeLink, setActiveLink] = useState(null); // Link activo (Click o Scroll)

  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('app_language', nextLang);
  };

  const navLinks = [
    { name: t('navbar.digitalTwin', 'DigitalTwin'), path: '#DigitalTwin' },
    { name: t('navbar.pricing', 'Pricing'), path: '#pricing' },
    { name: t('navbar.faqs', 'FAQ´s'), path: '#FAQ' },
  ];

  // --- DETECCIÓN DE SCROLL & SECCIÓN ACTIVA (SCROLL SPY) ---
  useMotionValueEvent(scrollY, "change", (latest) => {
    // 1. Lógica del Background (Glassmorphism)
    const previous = isScrolled;
    const current = latest > 20;
    if (previous !== current) setIsScrolled(current);

    // 2. Lógica de Sección Activa (Solo en Home)
    if (location.pathname === '/') {
      let currentSection = null;

      // Iteramos sobre las secciones para ver cuál está en el viewport
      for (const link of navLinks) {
        const section = document.querySelector(link.path);
        if (section) {
          const rect = section.getBoundingClientRect();
          // Offset de 150px para que se active un poco antes de llegar arriba
          // Verificamos que el top esté por encima o cerca del header, y que el bottom siga visible
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = link.name;
            break; // Encontramos la sección actual, dejamos de buscar
          }
        }
      }

      // Si estamos muy arriba (Hero), reseteamos. Si no, ponemos la sección encontrada.
      if (latest < 100) {
        setActiveLink(null);
      } else if (currentSection) {
        setActiveLink(currentSection);
      }
    }
  });

  // Cerrar menú al cambiar de ruta
  useEffect(() => { setIsOpen(false); }, [location]);

  // Bloquear scroll body en menú móvil
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const handleScrollTo = (e, id, name) => {
    e.preventDefault();
    setIsOpen(false);
    setActiveLink(name); // Feedback inmediato al click

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
        {/* BORDE LÁSER DE PROFUNDIDAD (Visible al scroll) */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">

          {/* --- LOGO --- */}
          <div className="flex items-start">
            <Link
              to="/"
              className="flex items-center gap-3 group relative select-none"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveLink(null);
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 ease-out"></div>
                <div className="w-10 h-10 relative bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 rounded-xl flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-indigo-500/10 border border-white/20 dark:border-white/10 group-hover:scale-105 transition-transform duration-300 overflow-hidden backdrop-blur-md">
                  <img
                    src="/Favicon.png"
                    alt="VeeBot Logo"
                    className="w-full h-full object-contain p-1.5 relative z-10 dark:brightness-110 dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] transition-all"
                  />
                </div>
              </div>

              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center">
                VeeBot<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 dark:from-indigo-400 dark:via-violet-400 dark:to-blue-400 font-extrabold">.ai</span>
              </span>
            </Link>
          </div>

          {/* --- DESKTOP MENU (NAVEGACIÓN LÍQUIDA REACTIVA) --- */}
          <div className="hidden md:flex items-center gap-2" onMouseLeave={() => setHoveredLink(null)}>
            <div className="flex items-center bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
              {navLinks.map((link) => {
                // Se activa si (hover actual) O (es activo por scroll/click Y no hay hover en otro lado)
                const isActive = (hoveredLink === link.name) || (activeLink === link.name && hoveredLink === null);

                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => handleScrollTo(e, link.path, link.name)}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    className="relative px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 z-10"
                  >
                    <span className={`relative z-20 transition-colors duration-200 ${isActive ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
                      {link.name}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="navbar-pill"
                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-4"></div>

            {/* Acciones */}
            <div className="flex items-center gap-3">
              {/* LANGUAGE SWITCH DESKTOP */}
              <button 
                onClick={toggleLanguage}
                title="Change Language"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 uppercase"
              >
                <Globe size={16} />
                <span>{i18n.language?.substring(0, 2)}</span>
              </button>

              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2"
              >
                {t('navbar.login', 'Login')}
              </Link>
              <Link
                to="/register"
                className="group relative px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-bold rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%_auto] animate-gradient-x"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {t('navbar.getStarted', 'Get Started')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
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

      {/* --- MOBILE MENU --- */}
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
                  onClick={(e) => handleScrollTo(e, link.path, link.name)}
                  className={`p-4 rounded-2xl text-lg font-medium transition-colors flex items-center justify-between group
                    ${activeLink === link.name
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  {link.name}
                  <ChevronRight size={16} className={`transition-all ${activeLink === link.name ? 'opacity-100 text-indigo-500' : 'opacity-0 group-hover:opacity-100'}`} />
                </motion.a>
              ))}

              <motion.div variants={itemVariants} className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-4" />

              <motion.div variants={itemVariants} className="flex flex-col gap-3 p-2">
                {/* LANGUAGE SWITCH MOBILE */}
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase"
                >
                  <Globe size={18} />
                  {i18n.language?.substring(0, 2) === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                </button>

                <Link
                  to="/login"
                  className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('navbar.login', 'Log In')}
                </Link>
                <Link
                  to="/register"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-center shadow-lg shadow-indigo-500/25 active:scale-95 transition-transform relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10">{t('navbar.getStartedFree', 'Get Started Free')}</span>
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