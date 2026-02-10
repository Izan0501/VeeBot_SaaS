import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ChevronDown, Mail, Trash2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const CandidatesTable = ({
    searchTerm, setSearchTerm, filterMenuRef, isFilterMenuOpen, setIsFilterMenuOpen,
    selectedLetter, setSelectedLetter, filteredCandidates, alphabet, handleSendEmail, handleDelete
}) => (
    <motion.div className="space-y-6 pt-6 scroll-mt-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        {/* BARRA DE CONTROL */}
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row gap-2 items-center justify-between transition-colors relative z-20">
            <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                </div>
                <input type="text" placeholder="Buscar talento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400" />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><X size={16} /></button>
                )}
            </div>
            <div className="relative w-full md:w-auto" ref={filterMenuRef}>
                <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className={`w-full md:w-auto flex items-center justify-between md:justify-center gap-3 px-5 py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${isFilterMenuOpen || selectedLetter !== "Todos" ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <span className="flex items-center gap-2"><Filter size={16} />{selectedLetter === "Todos" ? "Filtrar" : selectedLetter}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {isFilterMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-full md:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 z-50 origin-top-right">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inicial del nombre</span>
                                {selectedLetter !== "Todos" && <button onClick={() => { setSelectedLetter("Todos"); setIsFilterMenuOpen(false); }} className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold hover:underline">Restablecer</button>}
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {alphabet.map((letter) => (
                                    <button key={letter} onClick={() => { setSelectedLetter(letter); setIsFilterMenuOpen(false); }} className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 ${selectedLetter === letter ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-white'}`}>{letter}</button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* TABLA ESCRITORIO */}
        <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-colors relative">
            <div className="hidden min-[1050px]:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 table-fixed">
                    <thead className="bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md text-xs uppercase font-extrabold text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-5 w-[35%]">Candidato</th>
                            <th className="px-6 py-5 w-[20%]">Match IA</th>
                            <th className="px-6 py-5 w-[15%]">Estado</th>
                            <th className="px-6 py-5 w-[10%]">Fecha</th>
                            <th className="px-6 py-5 w-[20%] text-right pr-8">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredCandidates.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-20 text-center"><div className="flex flex-col items-center justify-center opacity-50"><Search size={48} className="mb-4 text-slate-300 dark:text-slate-600" /><p className="text-lg font-medium text-slate-500 dark:text-slate-400">No se encontraron candidatos.</p></div></td></tr>
                        ) : (
                            filteredCandidates.map((c) => (
                                <tr key={c.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-200">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-100 to-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black border border-indigo-100 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform duration-300">{c.name.charAt(0).toUpperCase()}</div>
                                            <div className="min-w-0"><p className="font-bold text-slate-900 dark:text-white truncate text-base">{c.name}</p><p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>{c.role || "Rol no especificado"}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5 max-w-[140px]">
                                            <div className="flex justify-between items-center"><span className={`text-xs font-bold ${c.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : c.score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>{c.score}% Relevancia</span></div>
                                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${c.score}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full rounded-full shadow-sm ${c.score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : c.score >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`} /></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5"><StatusBadge status={c.status} /></td>
                                    <td className="px-6 py-5"><span className="text-slate-400 dark:text-slate-500 font-semibold text-xs whitespace-nowrap">{c.date || "Reciente"}</span></td>
                                    <td className="px-6 py-5 pr-8">
                                        <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleSendEmail(c.id, 'interview')} className="group/btn relative p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all active:scale-95" title="Invitar a Entrevista"><Mail size={18} strokeWidth={2.5} /></button>
                                            <button onClick={() => handleSendEmail(c.id, 'rejection')} className="group/btn relative p-2.5 rounded-xl text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all active:scale-95" title="Enviar Rechazo"><X size={18} strokeWidth={2.5} /></button>
                                            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                            <button onClick={() => handleDelete(c.id)} className="group/btn relative p-2.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-95" title="Eliminar"><Trash2 size={18} strokeWidth={2.5} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* VISTA MOVIL */}
            <div className="min-[1050px]:hidden p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                {filteredCandidates.map((c) => (
                    <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg border border-indigo-100 dark:border-indigo-900">{c.name.charAt(0).toUpperCase()}</div>
                                <div><h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{c.name}</h4><p className="text-sm text-slate-500 font-medium">{c.role || "Sin rol"}</p></div>
                            </div>
                            <StatusBadge status={c.status} />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ajuste del Perfil</span><span className={`text-sm font-bold ${c.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{c.score}%</span></div>
                            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c.score >= 80 ? 'bg-emerald-500' : c.score >= 50 ? 'bg-amber-500' : 'bg-slate-400'}`} style={{ width: `${c.score}%` }}></div></div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button onClick={() => handleSendEmail(c.id, 'interview')} className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30 flex justify-center gap-2"><Mail size={16} /> Entrevista</button>
                            <button onClick={() => handleSendEmail(c.id, 'rejection')} className="py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"><X size={16} /></button>
                            <button onClick={() => handleDelete(c.id)} className="py-2.5 px-4 rounded-xl font-bold text-xs bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="text-center text-xs font-medium text-slate-400 pt-4 pb-8">Mostrando {filteredCandidates.length} candidatos ordenados por relevancia.</div>
    </motion.div>
);

export default CandidatesTable;