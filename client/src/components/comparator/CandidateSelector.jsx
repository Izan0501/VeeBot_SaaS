import React from 'react';
import { User, Loader2, Sparkles } from 'lucide-react';

const CandidateSelector = ({ candidates, selectedA, setSelectedA, selectedB, setSelectedB, onCompare, loading }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="grid md:grid-cols-7 gap-6 items-center">
                {/* LADO A */}
                <div className="md:col-span-3">
                    {/* eslint-disable-next-line react-doctor/label-has-associated-control */}
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidato A</label>
                    <div className="relative">
                        <select
                            className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900"
                            value={selectedA}
                            onChange={(e) => setSelectedA(e.target.value)}
                        >
                            <option value="">Seleccionar…</option>
                            {candidates.map(c => <option key={c.id} value={c.id}>{c.name} ({c.score}%)</option>)}
                        </select>
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                </div>

                {/* VS BADGE */}
                <div className="md:col-span-1 flex justify-center">
                    <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-300 dark:text-slate-600 italic text-xl border-4 border-white dark:border-slate-900 shadow-sm z-10">
                        VS
                    </div>
                </div>

                {/* LADO B */}
                <div className="md:col-span-3">
                    {/* eslint-disable-next-line react-doctor/label-has-associated-control */}
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidato B</label>
                    <div className="relative">
                        <select
                            className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900"
                            value={selectedB}
                            onChange={(e) => setSelectedB(e.target.value)}
                        >
                            <option value="">Seleccionar…</option>
                            {candidates.map(c => <option key={c.id} value={c.id}>{c.name} ({c.score}%)</option>)}
                        </select>
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button aria-label="Interactive control" type="button"
                    onClick={onCompare}
                    disabled={loading}
                    className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                    {loading ? "Analizando…" : "Iniciar Comparación"}
                </button>
            </div>
        </div>
    );
};

export default CandidateSelector;