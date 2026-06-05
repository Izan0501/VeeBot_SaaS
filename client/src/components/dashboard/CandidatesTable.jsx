/* eslint-disable react-doctor/rendering-hydration-mismatch-time */
/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ChevronDown, Mail, Trash2, Sparkles, MoreHorizontal, ArrowRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };


const CandidatesTable = ({
    searchTerm, setSearchTerm, filterMenuRef, isFilterMenuOpen, setIsFilterMenuOpen,
    selectedLetter, setSelectedLetter, filteredCandidates, alphabet, handleSendEmail, handleDelete
}) => {

    const triggerEmail = (candidate, type) => {
        const extractedEmail = candidate?.email || candidate?.metadata?.email || candidate?.contact_info?.email || candidate?.info?.email || candidate?.cv_data?.email;
        handleSendEmail(candidate.id, extractedEmail, type);
    };

    // Variantes para la animación de lista escalonada (Stagger)




    return (
        <div className="space-y-8 pt-2 pb-12">

            {/* --- BARRA DE CONTROL FLOTANTE (GLASS) --- */}
            <div className="sticky top-4 z-30 mx-auto max-w-full">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-[24px] border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-indigo-500/5 flex flex-col md:flex-row gap-3 items-center justify-between transition-all">

                    {/* Input de Búsqueda */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, rol o habilidades…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-10 py-3.5 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400"
                        />
                        {searchTerm && (
                            <button aria-label="Interactive control" type="button"
                                onClick={() => setSearchTerm("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
                            >
                                <m.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1 }}>
                                    <X size={16} />
                                </m.div>
                            </button>
                        )}
                    </div>

                    {/* Filtro Dropdown */}
                    <div className="relative w-full md:w-auto" ref={filterMenuRef}>
                        <button aria-label="Interactive control" type="button"
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`w-full md:w-auto flex items-center justify-between md:justify-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-bold border transition-all duration-300 active:scale-95 ${isFilterMenuOpen || selectedLetter !== "Todos"
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg shadow-indigo-500/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Filter size={16} />
                                {selectedLetter === "Todos" ? "Filtrar A-Z" : `Filtro: ${selectedLetter}`}
                            </span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isFilterMenuOpen && (
                                <m.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-3 w-full md:w-[340px] bg-white/90 dark:bg-[#0B0C15]/95 backdrop-blur-2xl rounded-[24px] shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 z-50 origin-top-right ring-1 ring-black/5"
                                >
                                    <div className="flex justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={12} className="text-indigo-500" /> Inicial del nombre
                                        </span>
                                        {selectedLetter !== "Todos" && (
                                            <button aria-label="Interactive control" type="button"
                                                onClick={() => { setSelectedLetter("Todos"); setIsFilterMenuOpen(false); }}
                                                className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-md font-bold hover:bg-indigo-100 transition-colors"
                                            >
                                                Limpiar
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-6 gap-2">
                                        {alphabet.map((letter) => (
                                            <button aria-label="Interactive control" type="button"
                                                key={letter}
                                                onClick={() => { setSelectedLetter(letter); setIsFilterMenuOpen(false); }}
                                                className={`size-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 ${selectedLetter === letter
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110 ring-2 ring-offset-2 ring-indigo-600 dark:ring-offset-slate-900'
                                                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-white hover:shadow-md'
                                                    }`}
                                            >
                                                {letter}
                                            </button>
                                        ))}
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* --- TABLA ORGÁSMICA (Desktop) --- */}
            <div className="hidden min-[1050px]:block">
                <div className="rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200/50 dark:border-slate-800">
                            <tr>
                                {["Candidato", "Match IA", "Estado", "Fecha", "Acciones"].map((header, i) => (
                                    <th suppressHydrationWarning key={header.id || header.name || header.title || crypto.randomUUID()} className={`px-8 py-6 text-xs uppercase font-bold text-slate-400 tracking-wider ${i === 4 ? 'text-right pr-10' : ''}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <m.tbody
                            className="divide-y divide-slate-100 dark:divide-slate-800/50"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredCandidates.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="size-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                                <Search size={32} className="text-slate-300 dark:text-slate-600" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No encontramos a nadie</h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">
                                                Intenta con otro término de búsqueda o cambia los filtros.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {filteredCandidates.map((c) => (
                                        <m.tr
                                            key={c.id}
                                            layout // <--- ESTO HACE LA MAGIA DEL REORDENAMIENTO FLUIDO
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors duration-300"
                                        >
                                            {/* COLUMNA 1: CANDIDATO */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <div className="size-14 rounded-[18px] bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-xl font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-110 group-hover:shadow-indigo-500/20 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-all duration-300">
                                                            {c.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        {c.score > 85 && (
                                                            <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1 border-2 border-white dark:border-slate-900">
                                                                <Sparkles size={10} className="text-white" fill="currentColor" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                            {c.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-2">
                                                            <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                            {c.role || "Candidato"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* COLUMNA 2: MATCH IA */}
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2 max-w-[160px]">
                                                    <div className="flex justify-between items-end">
                                                        <span className={`text-xs font-bold ${c.score >= 80 ? 'text-emerald-600 dark:text-emerald-400'
                                                                : c.score >= 50 ? 'text-amber-600 dark:text-amber-400'
                                                                    : 'text-slate-400'
                                                            }`}>
                                                            {c.score}% Match
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                        <m.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${c.score}%` }}
                                                            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                                                            className={`h-full rounded-full relative overflow-hidden ${c.score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                                                    : c.score >= 50 ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                                        : 'bg-slate-300 dark:bg-slate-600'
                                                                }`}
                                                        >
                                                            {/* Efecto de brillo animado en la barra */}
                                                            <div className="absolute inset-0 bg-white/30 w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                                        </m.div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* COLUMNA 3: ESTADO */}
                                            <td className="px-8 py-6">
                                                <StatusBadge status={c.status} />
                                            </td>

                                            {/* COLUMNA 4: FECHA */}
                                            <td className="px-8 py-6">
                                                <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    {c.date || "Hoy"}
                                                </span>
                                            </td>

                                            {/* COLUMNA 5: ACCIONES */}
                                            <td className="px-8 py-6 pr-10 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">

                                                    <button aria-label="Interactive control" type="button"
                                                        onClick={() => triggerEmail(c, 'interview')}
                                                        className="p-2.5 rounded-xl text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all active:scale-90"
                                                        title="Invitar"
                                                    >
                                                        <Mail size={18} strokeWidth={2.5} />
                                                    </button>

                                                    <button aria-label="Interactive control" type="button"
                                                        onClick={() => triggerEmail(c, 'rejection')}
                                                        className="p-2.5 rounded-xl text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all active:scale-90"
                                                        title="Rechazar"
                                                    >
                                                        <X size={18} strokeWidth={2.5} />
                                                    </button>

                                                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

                                                    <button aria-label="Interactive control" type="button"
                                                        onClick={() => handleDelete(c.id)}
                                                        className="p-2.5 rounded-xl text-rose-900 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all active:scale-90"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </td>
                                        </m.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </m.tbody>
                    </table>
                </div>
            </div>

            {/* --- VISTA MÓVIL (Cards Ultra-Estilizadas) --- */}
            <div className="min-[1050px]:hidden space-y-4">
                <AnimatePresence>
                    {filteredCandidates.map((c) => (
                        <m.div
                            key={c.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900/80 backdrop-blur-lg p-5 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-5 relative overflow-hidden"
                        >
                            {/* Barra de progreso de fondo sutil */}
                            <div className={`absolute top-0 left-0 h-1 ${c.score >= 80 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} style={{ width: `${c.score}%` }}></div>

                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl border border-indigo-100 dark:border-indigo-500/20">
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{c.name}</h4>
                                        <p className="text-sm text-slate-500 font-medium mt-0.5">{c.role || "Sin rol"}</p>
                                    </div>
                                </div>
                                <StatusBadge status={c.status} />
                            </div>

                            <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles size={12} /> Match IA
                                    </span>
                                    <span className={`text-sm font-black ${c.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                                        {c.score}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-100 dark:border-slate-700">
                                    <m.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${c.score}%` }}
                                        className={`h-full rounded-full ${c.score >= 80 ? 'bg-emerald-500' : c.score >= 50 ? 'bg-amber-500' : 'bg-slate-400'}`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button aria-label="Interactive control" type="button" onClick={() => triggerEmail(c, 'interview')} className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform flex justify-center items-center gap-2">
                                    Entrevista <ArrowRight size={14} />
                                </button>
                                <button aria-label="Interactive control" type="button" onClick={() => handleDelete(c.id)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 active:scale-95 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </m.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="text-center pt-6 pb-10">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-medium text-slate-400 border border-slate-200 dark:border-slate-800">
                    Mostrando {filteredCandidates.length} candidatos • Ordenados por relevancia IA
                </span>
            </div>
        </div>
    );
};

export default CandidatesTable;