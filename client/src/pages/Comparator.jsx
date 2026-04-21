import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// --- IMPORTS API ---
import { candidatesAPI } from '../api/candidates'; 
import { compareWithGroq } from '../api/groqClient';

// --- IMPORTS COMPONENTES ---
import ComparatorHeader from '../components/comparator/ComparatorHeader';
import CandidateSelector from '../components/comparator/CandidateSelector';
import ResultCard from '../components/comparator/ResultCard';
import VerdictCard from '../components/comparator/VerdictCard';

const Comparator = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedA, setSelectedA] = useState("");
    const [selectedB, setSelectedB] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar candidatos al inicio usando la API centralizada
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await candidatesAPI.getAll();
                if (Array.isArray(data)) {
                    setCandidates(data);
                }
            } catch (error) {
                console.error("Error fetching candidates for comparator:", error);
            }
        };
        fetchCandidates();
    }, []);

    const handleCompare = async () => {
        if (!selectedA || !selectedB) return toast.error("Selecciona dos candidatos");
        if (selectedA === selectedB) return toast.error("Elige candidatos distintos");

        setLoading(true);
        setResult(null);

        try {
            // Obtenemos los objetos completos de los candidatos ya cargados en estado
            const candA = candidates.find(c => c.id === selectedA);
            const candB = candidates.find(c => c.id === selectedB);

            if (!candA || !candB) throw new Error("Candidatos no encontrados");

            // Llamamos a Groq directamente desde el browser
            const data = await compareWithGroq(candA, candB);
            setResult(data);
            toast.success("¡Análisis completado!");
        } catch (error) {
            console.error(error);
            toast.error("Error al comparar. Verifica tu conexión.");
        } finally {
            setLoading(false);
        }
    };

    // Helper visual
    const getCandidateName = (id) => candidates.find(c => c.id === id)?.name || "Candidato";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors">
            <div className="max-w-6xl mx-auto">

                <ComparatorHeader />

                <CandidateSelector
                    candidates={candidates}
                    selectedA={selectedA}
                    setSelectedA={setSelectedA}
                    selectedB={selectedB}
                    setSelectedB={setSelectedB}
                    onCompare={handleCompare}
                    loading={loading}
                />

                {/* RESULTADOS */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {/* CARD GANADOR A */}
                            <ResultCard
                                isWinner={result.winner === "A"}
                                name={getCandidateName(selectedA)}
                                points={result.advantage_a}
                            />

                            {/* CARD GANADOR B */}
                            <ResultCard
                                isWinner={result.winner === "B"}
                                name={getCandidateName(selectedB)}
                                points={result.advantage_b}
                            />

                            {/* VEREDICTO FINAL */}
                            <VerdictCard
                                verdict={result.verdict}
                                winnerName={result.winner === "A" ? getCandidateName(selectedA) : getCandidateName(selectedB)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default Comparator;