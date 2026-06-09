import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ChevronDown, BrainCircuit, Bot, Database, Shield, FileText } from 'lucide-react';

const getIcon = (category) => {
    switch (category) {
        case 'Capacidades': return <BrainCircuit size={24} />;
        case 'Entrevistas': return <Bot size={24} />;
        case 'Datos': return <Database size={24} />;
        case 'Seguridad': return <Shield size={24} />;
        default: return <FileText size={24} />;
    }
};

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <m.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="group bg-white dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200 dark:border-white/5 rounded-xl p-4 hover:border-indigo-500/30 transition-colors relative overflow-hidden"
        >
            {/* Glow lateral */}
            {isOpen && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>}

            <button aria-label="Interactive control" type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none relative z-10"
            >
                <div className="flex items-center gap-5 md:gap-6">
                    <div className={`size-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${isOpen
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg rotate-3 scale-110'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-105'
                        }`}>
                        {getIcon(faq.category)}
                    </div>
                    <span className={`text-lg md:text-xl font-bold leading-tight pr-4 transition-colors ${isOpen
                        ? 'text-indigo-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}>
                        {faq.q}
                    </span>
                </div>

                <div className={`size-10 rounded-full flex items-center justify-center border transition-all duration-500 ${isOpen
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 rotate-180'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 group-hover:border-indigo-300'
                    }`}>
                    <ChevronDown size={20} className={`transition-colors ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} strokeWidth={2.5} />
                </div>
            </button>

            <div className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-6 md:px-8 pb-8 pl-[5.5rem] md:pl-[6.5rem]">
                        <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                            {faq.a}
                        </p>
                    </div>
                </div>
            </div>
        </m.div>
    );
};

export default FaqItem;