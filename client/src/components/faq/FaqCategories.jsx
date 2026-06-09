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
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === cat
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transform scale-105'
                    : 'bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
            >
                <span className="relative z-10">{cat}</span>
            </button>
        ))}
    </m.div>
);

export default FaqCategories;
