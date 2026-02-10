import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

// --- IMPORTS API Y CONTEXTO ---
import { candidatesAPI } from '../api/candidates'; // Para obtener lista
import { featuresAPI } from '../api/features';     // Para chatear
import { useAuth } from '../context/AuthContext';  // Para rol y usuario

// --- IMPORTS COMPONENTES ---
import CandidateList from '../components/digital-twin/CandidateList';
import ChatInterface from '../components/digital-twin/ChatInterface';
import EmptyState from '../components/digital-twin/EmptyState';

const DigitalTwin = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const scrollRef = useRef(null);
    const { user } = useAuth();
    const isPremium = user?.isPremium;
    const FREE_LIMIT = 2;

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await candidatesAPI.getAll();
                if (Array.isArray(data)) setCandidates(data);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        };
        fetchCandidates();
    }, []);

    // --- SCROLL AUTO ---
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // --- LOGICA ---
    const isLimitReached = () => {
        if (isPremium) return false;
        return messages.filter(m => m.role === 'user').length >= FREE_LIMIT;
    };


    const handleSelectCandidate = async (candidate) => {
        setSelectedCandidate(candidate);
        setLoading(true);

        try {
            // 1. Intentamos cargar historial real del backend
            const history = await candidatesAPI.getHistory(candidate._id || candidate.id);

            if (history && history.length > 0) {
                setMessages(history);
            } else {
                // 2. Si no hay historial, ponemos el mensaje de bienvenida por defecto
                setMessages([{
                    role: "assistant",
                    content: `Hola. Soy el gemelo digital de ${candidate.name.replace('.pdf', '')}. He procesado mi trayectoria profesional y estoy listo para validar mis competencias técnicas contigo.`
                }]);
            }
        } catch (error) {
            console.error("Error cargando historial", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedCandidate) return;

        if (isLimitReached()) {
            toast.error("Límite de preguntas alcanzado en el plan Free");
            return;
        }

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const candidateID = selectedCandidate._id || selectedCandidate.id;

            const data = await candidatesAPI.chatWithCandidate(candidateID, userMsg.content);

            setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        } catch (error) {
            console.error(error);

            // Verificamos si el mensaje de error contiene la palabra "Límite"
            // Nota: data.detail del backend llega aquí como error.message si lanzaste el Error correctamente en candidates.js
            if (error.message && error.message.includes("Límite")) {
                toast.error(error.message, {
                    duration: 5000,
                    icon: '🔒',
                });
                // Importante: Eliminar el mensaje "optimista" que agregamos visualmente antes
                setMessages(prev => prev.slice(0, -1));
            } else {
                toast.error("Error conectando con el gemelo digital");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans relative flex transition-colors duration-500">
            {/* Estilos para scrollbar custom */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 100vh; transition: all 0.3s ease; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #6366f1, #a855f7); box-shadow: 0 0 10px rgba(168, 85, 247, 0.5); }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(99, 102, 241, 0.3) transparent; }
            `}</style>

            {/* Background Orbes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* (Mismos divs de fondo animado que tenías) */}
            </div>

            <CandidateList
                candidates={candidates}
                selectedCandidate={selectedCandidate}
                onSelect={handleSelectCandidate}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isPremium={isPremium}
            />

            <div className={`flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/50 relative z-10 h-full w-full transition-all duration-500 ${selectedCandidate ? 'flex translate-x-0' : 'hidden lg:flex lg:translate-x-0'}`}>
                {selectedCandidate ? (
                    <ChatInterface
                        candidate={selectedCandidate}
                        messages={messages}
                        input={input}
                        setInput={setInput}
                        onSend={handleSendMessage}
                        loading={loading}
                        onBack={() => setSelectedCandidate(null)}
                        scrollRef={scrollRef}
                        isLimitReached={isLimitReached}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default DigitalTwin;