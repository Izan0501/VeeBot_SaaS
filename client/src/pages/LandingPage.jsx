import React from 'react';
import HeroSection      from '../components/landing/HeroSection';
import DataIntelligence from '../components/landing/DataIntelligence';
import DigitalTwinSection from '../components/landing/DigitalTwinSection';
import ComparatorSection  from '../components/landing/ComparatorSection';
import AnalyticsSection   from '../components/landing/AnalyticsSection';
import Pricing            from '../components/landing/Pricing';
import FaqSection         from '../components/landing/FAQ';
import ScrollToTopBtn     from '../components/landing/ScrollToTopBtn';

const LandingPage = () => {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2
      . Data Intelligence */}
      <DataIntelligence />

      {/* 3. Analytics Preview */}
      <AnalyticsSection />

      {/* 4. Comparator — Versus AI */}
      <ComparatorSection />

      {/* 5. Digital Twin */}
      <DigitalTwinSection />

      {/* 6. Pricing */}
      <Pricing />

      {/* 7. FAQ */}
      <FaqSection />

      {/* 8. Scroll-to-top (Floating) */}
      <ScrollToTopBtn />
    </>
  );
};

export default LandingPage;