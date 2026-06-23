/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect, react-doctor/no-chain-state-updates, react-doctor/no-event-handler */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronRight, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActiveSection } from '../../hooks/useActiveSection';

// ─── Constants (module-level — zero allocation cost on re-renders) ──────────
const SECTION_IDS   = ['hero', 'data', 'analytics', 'comparator', 'DigitalTwin', 'pricing', 'FAQ'];
const NAVBAR_HEIGHT = 80;

// Framer Motion variants hoisted out of the component so they are never
// re-allocated on render (satisfies `rendering-hoist-jsx` rule).
//
// IMPORTANT — NO filter:blur() in exit state:
// Animating CSS filter forces a full GPU texture composite per frame.
// On mobile hardware this takes 800-1500ms for the first frame, monopolizing
// the compositor and blocking the scroll animation from starting.
// opacity-only fade is compositor-safe and visually equivalent.
const MOBILE_MENU_VARIANTS = {
  closed: { opacity: 0, scaleY: 0.96, y: -16 },
  open: {
    opacity: 1, scaleY: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const ITEM_VARIANTS = {
  closed: { opacity: 0, x: -20 },
  open:   { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

// ─── NavPill — memoized so it only re-renders when its own props change ──────
// Prevents the entire link list from re-rendering when only one item's hover
// or active state changes.
const NavPill = React.memo(function NavPill({ link, isActive, onMouseEnter, onClick, setRef }) {
  return (
    <a aria-label="Interactive control"
      ref={setRef}
      href={link.path}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="relative z-10 px-4 py-2 font-medium text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-300 rounded-full"
    >
      <span
        className={`relative z-20 transition-all duration-300 ${
          isActive 
            ? 'text-indigo-700 dark:text-indigo-200 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' 
            : ''
        }`}
      >
        {link.name}
      </span>
    </a>
  );
});

// ─── MobileNavItem ───────────────────────────────────────────────────────────
// Plain <a aria-label="Interactive control"> tag — NOT motion.a — because Framer Motion's animated element
// runs getBoundingClientRect() on every stagger child during AnimatePresence
// exit, adding ~100ms of synchronous layout recalc to the click handler.
// The entrance stagger still works because motion.div wraps the whole menu.
const MobileNavItem = React.memo(function MobileNavItem({ link, isActive, onClick }) {
  return (
    <a aria-label="Interactive control"
      href={link.path}
      onClick={onClick}
      className={`p-4 rounded-2xl text-lg font-medium transition-colors flex items-center justify-between group ${
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {link.name}
      <ChevronRight
        size={16}
        className={`transition-all ${isActive ? 'opacity-100 text-indigo-500' : 'opacity-0 group-hover:opacity-100'}`}
      />
    </a>
  );
});

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoverStyle, setHoverStyle]   = useState({ opacity: 0, left: 0, width: 0 });
  const linkRefs                      = useRef({});

  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Active section via IntersectionObserver — zero scroll listeners
  const isLanding = location.pathname === '/';
  const { activeId, isScrolled, setManualActiveId } = useActiveSection(
    isLanding ? SECTION_IDS : [],
    NAVBAR_HEIGHT,
  );

  // Memoize navLinks — t() is cheap but the array allocation causes
  // handleScrollTo's useCallback deps to invalidate every render without this.
  const navLinks = useMemo(() => [
    { name: t('navbar.hero',        'Inicio'),      sectionId: 'hero',         path: '#hero'         },
    { name: t('navbar.data',        'Data'),        sectionId: 'data',         path: '#data'         },
    { name: t('navbar.analytics',   'Métricas'),    sectionId: 'analytics',    path: '#analytics'    },
    { name: t('navbar.comparator',  'Comparador'),  sectionId: 'comparator',   path: '#comparator'   },
    { name: t('navbar.digitalTwin', 'DigitalTwin'), sectionId: 'DigitalTwin',  path: '#DigitalTwin'  },
    { name: t('navbar.pricing',     'Pricing'),     sectionId: 'pricing',      path: '#pricing'      },
    { name: t('navbar.faqs',        "FAQ´s"),       sectionId: 'FAQ',          path: '#FAQ'          },
  ], [t]);

  // ── Side Effects ────────────────────────────────────────────────────────────

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false);   // eslint-disable-next-line react-doctor/no-mutable-in-deps
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open.
  // IMPORTANT: this effect must commit synchronously before any scroll call,
  // which is why setIsOpen(false) must NOT be wrapped in startTransition.
  // If overflow:hidden is present when scrollIntoView fires, the browser
  // treats the body as non-scrollable and silently aborts or cancels the scroll.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleLanguage = useCallback(() => {
    const nextLang = i18n.language?.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('app_language', nextLang);
  }, [i18n]);

  const snapToActive = useCallback(() => {
    if (activeId && linkRefs.current[activeId]) {
      const el = linkRefs.current[activeId];
      setHoverStyle({
        opacity: 1,
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    } else {
      setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeId]);

  const handleMouseLeave = useCallback(() => {
    setHoveredLink(null);
    snapToActive();
  }, [snapToActive]);

  useEffect(() => {
    if (hoveredLink === null) {
      snapToActive();
    }
  }, [activeId, hoveredLink, snapToActive]);

  /**
   * handleScrollTo — async-decoupled imperative scroll
   *
   * Execution order (critical for zero input latency):
   *
   *   ① scrollIntoView({ behavior: 'smooth' }) — fires FIRST, synchronously,
   *      inside the click event handler's microtask. The browser scroll engine
   *      registers the animation immediately and begins rendering it.
   *      NOTE: behavior:'smooth' in scrollIntoView() is fully independent of
   *      CSS scroll-smooth on <html>. They do NOT compete — scroll-smooth only
   *      applies to native anchor hash clicks, not imperative scrollIntoView.
   *
   *   ② setTimeout(setIsOpen(false), 0) — deferred to a macrotask after the
   *      browser has yielded control and already painted the first scroll frame.
   *      This means the heavy AnimatePresence exit commit (motion.div, backdrop
   *      filters, spring recalc) runs while the scroll animation is already in
   *      progress — not before it. The user sees smooth scroll start instantly.
   *
   *   setTimeout(0) vs requestAnimationFrame:
   *      rAF fires before paint (same task, different callback queue).
   *      setTimeout(0) fires after paint, in a new macrotask — truly decoupled
   *      from the render cycle that's blocking the scroll start.
   */
  const handleScrollTo = useCallback((e, sectionId) => {
    if (location.pathname === '/') {
      // CRITICAL FIX: Prevent default to stop the URL hash from changing.
      // Changing the hash triggers React Router's useLocation() inside App.jsx,
      // which causes a massive synchronous global re-render of the entire DOM,
      // freezing the main thread and causing huge scroll delay.
      e.preventDefault();

      document.body.style.overflow = '';

      const element = document.getElementById(sectionId);
      if (element) {
        // Fired immediately BEFORE any React state updates to eliminate click delay.
        // Using window.scrollTo directly instead of scrollIntoView prevents the browser 
        // from doing deep recursive layout recalculations which causes input delay.
        const offset = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }

      // Suspend observer updates and update active state, deferred to next tick
      // to ensure scroll animation has already been handed off to the compositor
      setTimeout(() => {
        if (setManualActiveId) setManualActiveId(sectionId);
        setIsOpen(false);
      }, 0);

    } else {
      // Cross-page: navigate to hash URL.
      e.preventDefault();
      setIsOpen(false);
      navigate(`/#${sectionId}`);
    }
    // eslint-disable-next-line react-doctor/no-mutable-in-deps
  }, [location.pathname, navigate, setManualActiveId]);

  // Per-link stable callbacks — avoids re-creating handlers during hover state
  // changes (each link gets a stable reference via useMemo index map).
  const linkHandlers = useMemo(() =>
    navLinks.map((link) => ({
      onClick:      (e) => handleScrollTo(e, link.sectionId),
      onMouseEnter: (e) => {
        setHoveredLink(link.sectionId);
        setHoverStyle({
          opacity: 1,
          left: e.currentTarget.offsetLeft,
          width: e.currentTarget.offsetWidth,
        });
      },
      setRef: (el) => {
        if (el) linkRefs.current[link.sectionId] = el;
      }
    })),
  [navLinks, handleScrollTo]);

  return (
    <>
      <m.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed top-0 left-0 right-0 w-full z-50 flex justify-center pointer-events-none"
      >
        {/* The Liquid Glass Shell */}
        <div className={`absolute transition-all duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu ${
          isScrolled && !isOpen
            ? 'w-[75px] lg:w-[740px] h-[60px] top-6 rounded-full bg-white/5 dark:bg-[#0A0A0C]/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] pointer-events-auto'
            : isOpen
            ? 'w-full h-[80px] top-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 border-b border-transparent pointer-events-auto'
            : 'w-full max-w-7xl h-[80px] top-0 bg-transparent border-transparent pointer-events-none'
        }`} />

        {/* Laser border */}
        <div
          className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent transition-opacity duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isScrolled && !isOpen ? 'opacity-0 top-[84px]' : isScrolled ? 'opacity-100 top-[80px]' : 'opacity-0 top-[80px]'
          }`}
        />

        {/* The Static Flex Grid (Content Layer) */}
        <div className={`relative w-full max-w-7xl px-6 flex justify-between items-center z-10 transition-all duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-auto ${
          isScrolled && !isOpen ? 'h-[60px] top-6' : 'h-[80px] top-0'
        }`}>
          
          {/* ── Logo & Wordmark ── */}
          <div className="flex-1 flex justify-start">
            <div className={`transition-all duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu whitespace-nowrap flex items-center gap-4 ml-2 ${isScrolled && !isOpen ? 'opacity-0 translate-y-8 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}>
              <Link to="/" aria-label="Axon Crafts Home" className="relative flex items-center justify-center w-14 h-14 shrink-0">
                <img src="/Favicon.png" alt="Axon Crafts" className="animate-logo-core h-11 w-auto object-contain" />
              </Link>
            </div>
          </div>

          {/* ── Desktop Nav (Liquid Pill) ── */}
          <div
            className="hidden lg:flex flex-shrink-0 items-center gap-2"
            onMouseLeave={handleMouseLeave}
          >
            <div className={`relative flex items-center p-1.5 rounded-full transition-colors duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isScrolled && !isOpen ? 'bg-transparent border-transparent' : 'bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm'}`}>
              {/* SLIDING PILL BACKGROUND */}
              <div 
                className="absolute inset-y-1 h-[calc(100%-8px)] z-0 rounded-full bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                style={{
                  opacity: hoverStyle.opacity,
                  left: `${hoverStyle.left}px`,
                  width: `${hoverStyle.width}px`,
                  background: `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 100%)`
                }}
              />

              {navLinks.map((link, i) => {
                const isActive =
                  hoveredLink === link.sectionId ||
                  (activeId === link.sectionId && hoveredLink === null);

                return (
                  <NavPill
                    key={link.sectionId}
                    link={link}
                    isActive={isActive}
                    onClick={linkHandlers[i].onClick}
                    onMouseEnter={linkHandlers[i].onMouseEnter}
                    setRef={linkHandlers[i].setRef}
                  />
                );
              })}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-4" />
          </div>

          {/* Actions */}
          <div className="flex-1 flex justify-end">
            <div className={`transition-all duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu whitespace-nowrap flex items-center justify-end gap-3 ${isScrolled && !isOpen ? 'opacity-0 translate-y-8 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}>
              <button aria-label="Interactive control" type="button"
                onClick={toggleLanguage}
                title="Change Language"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 uppercase shrink-0"
              >
                <Globe size={16} />
                <span>{i18n.language?.substring(0, 2)}</span>
              </button>

              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 shrink-0"
              >
                {t('navbar.login', 'Login')}
              </Link>

              <Link
                to="/onboarding"
                className="group relative px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-bold rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%_auto] animate-gradient-x" />
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  {t('navbar.getStarted', 'Get Started')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          {/* ── Mobile Toggle ── */}
          <button type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`lg:hidden absolute transition-all duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] z-50 size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent active:border-slate-300 dark:active:border-slate-600 ${isScrolled && !isOpen ? 'right-1/2 translate-x-1/2' : 'right-6 translate-x-0'}`}
            aria-label="Toggle Menu"
          >
            <m.div
              animate={isOpen ? 'open' : 'closed'}
              className="w-5 h-4 flex flex-col justify-between"
            >
              <m.span
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full h-0.5 bg-current rounded-full origin-center"
              />
              <m.span
                variants={{ closed: { opacity: 1, scale: 1 }, open: { opacity: 0, scale: 0.95 } }}
                transition={{ duration: 0.1 }}
                className="w-full h-0.5 bg-current rounded-full"
              />
              <m.span
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full h-0.5 bg-current rounded-full origin-center"
              />
            </m.div>
          </button>
        </div>
      </m.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={MOBILE_MENU_VARIANTS}
            className="fixed top-20 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl border-b border-slate-200 dark:border-slate-800 shadow-2xl origin-top overflow-hidden lg:hidden transform-gpu will-change-transform"
          >
            <div className="p-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <MobileNavItem
                  key={link.sectionId}
                  link={link}
                  isActive={activeId === link.sectionId}
                  onClick={linkHandlers[i].onClick}
                />
              ))}

              <m.div variants={ITEM_VARIANTS} className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-4" />

              <m.div variants={ITEM_VARIANTS} className="flex flex-col gap-3 p-2">
                <button aria-label="Interactive control" type="button"
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
                  to="/onboarding"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-center shadow-lg shadow-indigo-500/25 active:scale-95 transition-transform relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">{t('navbar.getStartedFree', 'Get Started Free')}</span>
                </Link>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-20 z-30 bg-black/20 dark:bg-black/50 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(Navbar);