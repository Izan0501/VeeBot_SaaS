import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, XCircle, Radio, ChevronRight } from 'lucide-react';

const CandidateList = ({
    candidates,
    selectedCandidate,
    onSelect,
    searchQuery,
    setSearchQuery,
    isPremium
}) => {
    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`
            w-full lg:w-[420px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 
            flex flex-col z-20 shadow-2xl lg:shadow-none h-full absolute lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${selectedCandidate ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}>
            {/* Header Sidebar */}
            <div className="p-6 md:p-8 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

                <div className="relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tighter"
                    >
                        Digital<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Twins</span>
                        {isPremium ? (
                            <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest shadow-sm">Pro</span>
                        ) : (
                            <span className="text-[10px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest opacity-80">Beta</span>
                        )}
                    </motion.h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        {candidates.length} simulaciones neuronales listas.
                    </p>
                </div>

                <div className="mt-8 relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur-sm group-focus-within:blur-md"></div>
                    <div className="relative flex items-center bg-white dark:bg-slate-950 rounded-2xl shadow-sm">
                        <Search className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Filtrar por talento..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-slate-700 dark:text-slate-200 text-base font-medium rounded-2xl py-4 pl-12 pr-10 outline-none placeholder:text-slate-400/80"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <XCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Lista Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar scroll-smooth">
                <AnimatePresence>
                    {filteredCandidates.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Search size={32} className="opacity-50" />
                            </div>
                            <p className="text-sm font-medium">Sin resultados encontrados.</p>
                        </motion.div>
                    ) : (
                        filteredCandidates.map((c, i) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                            >
                                <button
                                    onClick={() => onSelect(c)}
                                    className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all duration-300 group border relative overflow-hidden shrink-0
                                    ${selectedCandidate?.id === c.id
                                            ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white shadow-xl shadow-slate-900/20 dark:shadow-white/5 scale-[1.02]'
                                            : 'bg-white/50 dark:bg-slate-800/30 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-100 dark:hover:border-slate-700'}`}
                                >
                                    <div className="relative">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner relative z-10 transition-colors
                                            ${selectedCandidate?.id === c.id
                                                ? 'bg-white/20 text-white dark:text-slate-900 backdrop-blur-md'
                                                : 'bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300 group-hover:from-indigo-100 dark:group-hover:from-slate-600'}`}
                                        >
                                            {c.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedCandidate?.id === c.id ? 'bg-green-400' : 'bg-slate-400'}`}></span>
                                            <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white dark:border-slate-800 ${selectedCandidate?.id === c.id ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0 text-left">
                                        <h4 className={`text-base font-bold truncate transition-colors ${selectedCandidate?.id === c.id ? 'text-white dark:text-slate-900' : 'text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                                            {c.name.replace('.pdf', '').replace('.docx', '')}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${selectedCandidate?.id === c.id ? 'bg-white/20 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500'}`}>
                                                Ready
                                            </span>
                                            {selectedCandidate?.id === c.id &&
                                                <span className="text-xs text-indigo-300 dark:text-slate-600 font-medium animate-pulse">Conectando...</span>
                                            }
                                        </div>
                                    </div>

                                    <ChevronRight
                                        size={20}
                                        className={`transition-all duration-300 ${selectedCandidate?.id === c.id
                                            ? 'text-white dark:text-slate-900 translate-x-1'
                                            : 'text-slate-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                                            }`}
                                    />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CandidateList;