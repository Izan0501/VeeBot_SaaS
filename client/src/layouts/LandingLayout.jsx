import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ThemeController from '../components/common/ThemeController';

const LandingLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="flex-grow relative z-0">
        {children}
      </main>
      <Footer />
      {/* Switch de tema flotante — solo en zona pública */}
      <ThemeController />
    </div>
  );
};

export default LandingLayout;