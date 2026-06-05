import React from 'react';

// ── Landing Sections ────────────────────────────────────────────────────────
import HeroSection      from '../components/landing/HeroSection';
import DataIntelligence from '../components/landing/DataIntelligence';
import DigitalTwinSection from '../components/landing/DigitalTwinSection';
import ComparatorSection  from '../components/landing/ComparatorSection';
import Pricing            from '../components/landing/Pricing';
import FaqSection         from '../components/landing/FAQ';
import ScrollToTopBtn     from '../components/landing/ScrollToTopBtn';

/**
 * LandingPage
 *
 * Performance notes:
 * - Removed the redundant `scroll` event listener (was only used to derive
 *   `isScrolled`, which is now handled by the Navbar's useActiveSection hook
 *   via IntersectionObserver — zero raw scroll listeners on the landing page).
 * - `useNavigate` removed (was unused after handleNavigation cleanup).
 */
const LandingPage = () => {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Comparator — Versus AI */}
      <ComparatorSection />

      {/* 3. Digital Twin */}
      <DigitalTwinSection />

      {/* 4. Data Intelligence */}
      <DataIntelligence />

      {/* 5. FAQ */}
      <FaqSection />

      {/* 6. Pricing */}
      <Pricing />

      {/* 7. Scroll-to-top (Floating) */}
      <ScrollToTopBtn />
    </>
  );
};

export default LandingPage;