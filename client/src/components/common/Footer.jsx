/* eslint-disable react-doctor/anchor-is-valid, react-doctor/control-has-associated-label */
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { label: "Inicio", href: "#hero" },
    { label: "Digital Twin", href: "#DigitalTwin" },
    { label: "Comparator", href: "#comparator" },
    { label: "Pricing", href: "#pricing" }
  ],
  resources: [
    { label: "Help Center", href: "/faq" },
    { label: "FAQ", href: "/faq" },
  ],
  company: [
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", href: "#" }
  ]
};

const Footer = () => {
  const footerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <footer 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden pt-24 pb-12 bg-gradient-to-b from-[#16082b] via-[#0b0316] to-[#030108] border-t border-purple-500/20 shadow-[inset_0_1px_0_rgba(168,85,247,0.1)] group"
    >
      {/* Dynamic Cursor Spotlight */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-1000 ease-in-out"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <div 
          className="absolute w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_rgba(147,51,234,0.05)_40%,_transparent_70%)] blur-3xl"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`
          }}
        />
      </div>
      <style>{`
        @keyframes fluid-chrome {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .text-liquid-chrome {
          background: linear-gradient(
            to right, 
            #2e0c59 0%, 
            #9333ea 20%, 
            #f3e8ff 40%, 
            #ffffff 50%, 
            #f3e8ff 60%, 
            #9333ea 80%, 
            #2e0c59 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: fluid-chrome 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
      {/* Galactic Nebula Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/30 via-transparent to-transparent blur-3xl" />
      
      {/* Cinematic Underglow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-primary)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        
        {/* Cinematic CTA */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">

            <div className="relative mb-4">
              {/* Ghost Aura Layer */}
              <h2 className="absolute top-0 left-0 w-full text-5xl md:text-7xl font-bold tracking-tight text-liquid-chrome blur-xl opacity-60 pointer-events-none select-none">
                Join the Future
              </h2>
              {/* Main Text */}
              <h2 className="relative text-5xl md:text-7xl font-bold tracking-tight text-liquid-chrome drop-shadow-[0_0_15px_rgba(192,132,252,0.2)]">
                Join the Future
              </h2>
            </div>
            <p className="text-white/50 text-lg md:text-xl max-w-md">
              Start building with VeeBot today and experience next-generation infrastructure.
            </p>
          </div>
          
        </div>

        {/* Elite SaaS Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-24">
          <div>
            <h3 className="text-purple-300/50 text-xs font-bold tracking-[0.2em] uppercase mb-6">Product</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a aria-label="Interactive control" href={link.href} className="text-white/60 hover:text-purple-300 hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group">
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-purple-300/50 text-xs font-bold tracking-[0.2em] uppercase mb-6">Resources</h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/60 hover:text-purple-300 hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group">
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-purple-300/50 text-xs font-bold tracking-[0.2em] uppercase mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/60 hover:text-purple-300 hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group">
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-purple-300/50 text-xs font-bold tracking-[0.2em] uppercase mb-6">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="text-white/60 hover:text-purple-300 hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group">
                      <span>{link.label}</span>
                    </Link>
                  ) : (
                    <a aria-label="Interactive control" href={link.href} className="text-white/60 hover:text-purple-300 hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group">
                      <span>{link.label}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brand Anchor */}
        <div className="border-t border-purple-900/20 mt-24 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="VeeBot Home"
            className="flex items-center gap-3 group"
          >
            <img src="/Favicon.png" alt="VeeBot" className="h-8 w-auto object-contain group-hover:drop-shadow-[0_0_8px_var(--color-primary)] transition-all duration-500" />
            <span className="text-white font-bold tracking-tight">VeeBot</span>
          </Link>

          <p suppressHydrationWarning className="text-white/40 text-sm">
            © {new Date().getFullYear()} VeeBot Inc. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <a aria-label="Interactive control" href="#" className="text-white/40 hover:text-[var(--color-primary)] transition-colors duration-300">
              <Twitter size={20} />
            </a>
            <a aria-label="Interactive control" href="#" className="text-white/40 hover:text-[var(--color-primary)] transition-colors duration-300">
              <Linkedin size={20} />
            </a>
            <a aria-label="Interactive control" href="#" className="text-white/40 hover:text-[var(--color-primary)] transition-colors duration-300">
              <Github size={20} />
            </a>
            <a aria-label="Interactive control" href="#" className="text-white/40 hover:text-[var(--color-primary)] transition-colors duration-300">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;