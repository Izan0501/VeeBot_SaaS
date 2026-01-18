import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Swords, CheckCircle, AlertCircle, Trophy, User, ArrowRight, Loader2, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const Comparator = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedA, setSelectedA] = useState("");
    const [selectedB, setSelectedB] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar candidatos al inicio
    useEffect(() => {
        const fetchCandidates = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/candidates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setCandidates(await res.json());
        };
        fetchCandidates();
    }, []);

    const handleCompare = async () => {
        if (!selectedA || !selectedB) return toast.error("Selecciona dos candidatos");
        if (selectedA === selectedB) return toast.error("Elige candidatos distintos");

        setLoading(true);
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/analyze/compare', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    candidate_id_a: selectedA,
                    candidate_id_b: selectedB
                })
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
                toast.success("¡Análisis completado!");
            } else {
                throw new Error("Error en la API");
            }
        } catch (error) {
            toast.error("Error al comparar. Verifica tu plan.");
        } finally {
            setLoading(false);
        }
    };

    // Helpers visuales
    const getCandidateName = (id) => candidates.find(c => c.id === id)?.name || "Candidato";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
                        <Swords size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                        Comparador <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Versus AI</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                        ¿Indeciso? Deja que la Inteligencia Artificial analice fortalezas y debilidades frente a frente para darte un veredicto objetivo.
                    </p>
                </motion.div>

                {/* SELECTOR AREA */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    <div className="grid md:grid-cols-7 gap-6 items-center">
                        {/* LADO A */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidato A</label>
                            <div className="relative">
                                <select
                                    className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900"
                                    value={selectedA}
                                    onChange={(e) => setSelectedA(e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {candidates.map(c => <option key={c.id} value={c.id}>{c.name} ({c.score}%)</option>)}
                                </select>
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>

                        {/* VS BADGE */}
                        <div className="md:col-span-1 flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-300 dark:text-slate-600 italic text-xl border-4 border-white dark:border-slate-900 shadow-sm z-10">
                                VS
                            </div>
                        </div>

                        {/* LADO B */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidato B</label>
                            <div className="relative">
                                <select
                                    className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900"
                                    value={selectedB}
                                    onChange={(e) => setSelectedB(e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {candidates.map(c => <option key={c.id} value={c.id}>{c.name} ({c.score}%)</option>)}
                                </select>
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleCompare}
                            disabled={loading}
                            className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                            {loading ? "Analizando..." : "Iniciar Comparación"}
                        </button>
                    </div>
                </div>

                {/* RESULTADOS */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {/* CARD GANADOR A (Si gana A o B) */}
                            <ResultCard
                                isWinner={result.winner === "A"}
                                name={getCandidateName(selectedA)}
                                points={result.advantage_a}
                                side="A"
                            />

                            <ResultCard
                                isWinner={result.winner === "B"}
                                name={getCandidateName(selectedB)}
                                points={result.advantage_b}
                                side="B"
                            />

                            {/* VEREDICTO FINAL */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="relative z-10 text-center">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                                        <Trophy className="text-yellow-400 fill-yellow-400" /> Veredicto de la IA
                                    </h3>
                                    <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl mx-auto font-medium">
                                        "{result.verdict}"
                                    </p>
                                    <div className="mt-6 inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-sm font-bold tracking-wide">
                                        Ganador Sugerido: {result.winner === "A" ? getCandidateName(selectedA) : getCandidateName(selectedB)}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

const ResultCard = ({ isWinner, name, points, side }) => (
    <motion.div
        className={`rounded-3xl p-8 border-2 relative overflow-hidden transition-all duration-500
        ${isWinner
                ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02] z-10'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100 grayscale-[0.5] hover:grayscale-0'
            }`}
    >
        {isWinner && (
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                MEJOR OPCIÓN
            </div>
        )}

        <h3 className={`text-2xl font-black mb-6 ${isWinner ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            {name}
        </h3>

        <ul className="space-y-4">
            {points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full ${isWinner ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                        {isWinner ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    </div>
                    <span className={`text-sm font-medium ${isWinner ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'}`}>
                        {point}
                    </span>
                </li>
            ))}
        </ul>
    </motion.div>
);

export default Comparator;