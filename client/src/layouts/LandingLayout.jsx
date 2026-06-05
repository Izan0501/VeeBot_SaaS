import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ThemeController from '../components/common/ThemeController';

const LandingLayout = ({ children }) => {
  React.useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    return () => document.documentElement.classList.remove('scroll-smooth');
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-slate-950 text-indigo-900 dark:text-white transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      {/*
        isolation-isolate: creates a new stacking context so backdrop-filter
        on the Navbar doesn't trigger paint invalidation on child elements.
        will-change-scroll-position: hints to the compositor to create a
        dedicated scroll layer for buttery-smooth scroll on supported browsers.
      */}
      <main className="flex-grow relative z-0 isolation-isolate">
        {children}
      </main>
      <Footer />
      {/* Floating theme switch — public zone only */}
      <ThemeController />
    </div>
  );
};

export default LandingLayout;