import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SECCIONES DE LA LANDING ---
import HeroSection from '../components/landing/HeroSection';
import DataIntelligence from '../components/landing/DataIntelligence';
import DigitalTwinSection from '../components/landing/DigitalTwinSection';
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

      {/* 3. DIGITAL TWIN */}
      <DigitalTwinSection />

      {/* 4. PRICING */}
      <Pricing />

      {/* 5. FAQ */}
      <FAQ />
    </>
  );
};

export default LandingPage;