import React from 'react';
import { m } from 'framer-motion';

const FaqCategories = ({ categories, activeCategory, setActiveCategory }) => (
    <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center gap-3 mb-16 relative z-10"
    >
        {categories.map((cat) => (
            <button aria-label="Interactive control" type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all relative overflow-hidden group ${activeCategory === cat.id
                    ? 'text-white shadow-lg shadow-indigo-500/30 scale-105'
                    : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    }`}
            >
                {activeCategory === cat.id && (
                    <m.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600"
                    />
                )}
                <span className="relative z-10">{cat.label}</span>
            </button>
        ))}
    </m.div>
);

export default FaqCategories;
