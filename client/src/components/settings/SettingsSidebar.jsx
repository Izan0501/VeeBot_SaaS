import React from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, BrainCircuit, Shield, Crown, ChevronRight } from 'lucide-react';

const SettingsSidebar = ({ formData, isPremium, activeSection, scrollToSection, itemVars }) => {
  return (
    <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit z-10 space-y-6">
      {/* User Card */}
      <motion.div variants={itemVars} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-800/50"></div>
        <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mb-4 shadow-2xl ${isPremium ? 'bg-gradient-to-tr from-amber-300 to-orange-500 text-white ring-4 ring-white dark:ring-slate-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
          {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
          {isPremium && <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-900 p-1 rounded-full"><div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"></div></div>}
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white relative">{formData.name}</h2>
        <p className="text-xs text-slate-400 mb-6 relative">{formData.email}</p>

        {isPremium ?
          <span className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-700 flex items-center gap-1.5 shadow-sm">
            <Crown size={14} className="fill-amber-500 text-amber-500" /> Agency Pro
          </span>
          :
          <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold border border-slate-200 dark:border-slate-700">Plan Gratuito</span>
        }
      </motion.div>

      {/* Menu Navigation */}
      <motion.div variants={itemVars} className="hidden lg:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-2">
        {[
          { id: 'profile', icon: <User size={18} />, label: 'Perfil' },
          { id: 'subscription', icon: <CreditCard size={18} />, label: 'Suscripción' },
          { id: 'ai', icon: <BrainCircuit size={18} />, label: 'Inteligencia Artificial' },
          { id: 'security', icon: <Shield size={18} />, label: 'Seguridad' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`w-full flex items-center justify-between px-5 py-4 text-sm font-medium transition-all rounded-2xl mb-1 last:mb-0
                  ${activeSection === item.id
                ? 'bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
          >
            <div className="flex items-center gap-3">{item.icon} <span>{item.label}</span></div>
            {activeSection === item.id && <ChevronRight size={16} />}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default SettingsSidebar;