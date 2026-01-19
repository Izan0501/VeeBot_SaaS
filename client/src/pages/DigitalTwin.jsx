import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, User, Bot, Sparkles, MoreVertical, Phone, Video,
    Lock, Loader2, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DigitalTwin = () => {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Límite para usuarios Free (Simulado)
    const FREE_LIMIT = 4;

    // Cargar candidatos
    useEffect(() => {
        const fetchCandidates = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/candidates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
                if (data.length > 0) setSelectedCandidate(data[0]);
            }
        };
        fetchCandidates();
    }, []);

    // Auto-scroll al final del chat
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedCandidate) return;

        // Verificar Límite Free
        if (messages.length >= FREE_LIMIT) {
            toast.error("Límite de preguntas alcanzado en el plan Free");
            return;
        }

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/simulate/chat', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    candidate_id: selectedCandidate.id,
                    message: userMsg.content,
                    history: messages // Enviamos historial para contexto
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            } else {
                throw new Error("Error en la respuesta");
            }
        } catch (error) {
            toast.error("Error conectando con el gemelo digital");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        setMessages([]); // Limpiar chat al cambiar
        // Mensaje inicial de bienvenida
        setMessages([{
            role: "assistant",
            content: `Hola, soy la versión digital de ${candidate.name.split('.')[0]}. Estoy listo para responder tus preguntas sobre mi experiencia.`
        }]);
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 overflow-hidden">

            {/* SIDEBAR: LISTA DE CONTACTOS */}
            <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Bot className="text-indigo-600" /> Digital Twins
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Simulaciones activas</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {candidates.map(c => (
                        <button
                            key={c.id}
                            onClick={() => handleSelectCandidate(c)}
                            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${selectedCandidate?.id === c.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className={`text-sm font-bold truncate ${selectedCandidate?.id === c.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {c.name.replace('.pdf', '')}
                                </p>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 relative">

                {selectedCandidate ? (
                    <>
                        {/* CHAT HEADER */}
                        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                    {selectedCandidate.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                                        {selectedCandidate.name.replace('.pdf', '')} (AI)
                                    </h3>
                                    <p className="text-xs text-indigo-500 font-medium">Gemelo Digital Activo</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <Phone size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
                                <Video size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
                                <MoreVertical size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
                            </div>
                        </div>

                        {/* MESSAGES AREA */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
                            {/* FONDO PATTERN */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />

                            {/* PREVIEW LOCK (Si llegan al límite) */}
                            {messages.length >= FREE_LIMIT && (
                                <div className="flex justify-center mt-8">
                                    <div className="bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-pulse cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/upgrade')}>
                                        <Lock size={16} />
                                        <span className="text-sm font-bold">Sesión Finalizada. Desbloquear Ilimitado.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* INPUT AREA */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={messages.length >= FREE_LIMIT || loading}
                                    placeholder={messages.length >= FREE_LIMIT ? "Actualiza tu plan para continuar..." : "Pregúntale algo sobre su experiencia..."}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim() || messages.length >= FREE_LIMIT}
                                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    // EMPTY STATE
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <MessageSquare size={40} className="text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Selecciona un Gemelo Digital</h2>
                        <p className="max-w-md text-center">
                            Elige un candidato del menú para iniciar una simulación de entrevista en tiempo real.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigitalTwin;