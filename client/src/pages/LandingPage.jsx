import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SECCIONES DE LA LANDING ---
import HeroSection from '../components/landing/HeroSection';
import DataIntelligence from '../components/landing/DataIntelligence';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import Pricing from '../components/landing/Pricing'; 
import FAQ from '../components/landing/FAQ';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener para efectos visuales (opcional)
  useEffect(() => {
    const handleScrollListener = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScrollListener);
    return () => window.removeEventListener('scroll', handleScrollListener);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* 1. HERO SECTION */}
      <HeroSection onNavigate={handleNavigation} isScrolled={isScrolled} />

      {/* 2. DATA INTELLIGENCE */}
      <DataIntelligence />

      {/* SEPARATOR FADE */}
      <div className="h-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 w-full"></div>

      {/* 3. FEATURES */}
      <FeaturesGrid />

      {/* SEPARATOR GRADIENT */}
      <div className="h-32 bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900 w-full"></div>

      {/* 4. PRICING */}
      <Pricing />

      {/* 5. FAQ */}
      <FAQ />
    </>
  );
};

export default LandingPage;