import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Bot, Lock, Loader2, Search, Sparkles, Cpu, Radio,
    XCircle, ArrowLeft, ChevronRight, Zap, Code2, BrainCircuit
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
    const [searchQuery, setSearchQuery] = useState("");
    const scrollRef = useRef(null);

    const FREE_LIMIT = 4;

    useEffect(() => {
        const fetchCandidates = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/candidates', { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
            }
        };
        fetchCandidates();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedCandidate) return;

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
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidate_id: selectedCandidate.id, message: userMsg.content, history: messages })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            } else {
                throw new Error("Error");
            }
        } catch (error) {
            toast.error("Error conectando con el gemelo digital");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        setMessages([]);
        setTimeout(() => {
            setMessages([{
                role: "assistant",
                content: `Hola. Soy el gemelo digital de ${candidate.name.replace('.pdf', '').replace('.docx', '')}. He procesado mi trayectoria profesional y estoy listo para validar mis competencias técnicas contigo.`
            }]);
        }, 600);
    };

    const handleBackToList = () => {
        setSelectedCandidate(null);
    };

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans relative flex transition-colors duration-500">

            {/* --- BACKGROUND VIVO (ORBES FLOTANTES) --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0], y: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, -30, 0], y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"
                />
            </div>

            {/* ====================================================================================
                COLUMNA IZQUIERDA: LISTA DE CANDIDATOS
            ==================================================================================== */}
            <div className={`
                w-full lg:w-[420px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 
                flex-col z-20 shadow-2xl lg:shadow-none h-full absolute lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${selectedCandidate ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
            `}>

                {/* Header Sidebar */}
                <div className="p-6 md:p-8 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0 relative overflow-hidden">
                    {/* Decoración sutil header */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tighter"
                        >
                            Digital Twins<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">AI</span>
                        </motion.h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                            {candidates.length} simulaciones neuronales listas.
                        </p>
                    </div>

                    {/* Search Input "Floaty" */}
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

                {/* Lista Ultra-Estilizada */}
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
                                        onClick={() => handleSelectCandidate(c)}
                                        className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all duration-300 group border relative overflow-hidden
                                        ${selectedCandidate?.id === c.id
                                                ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white shadow-xl shadow-slate-900/20 dark:shadow-white/5 scale-[1.02]'
                                                : 'bg-white/50 dark:bg-slate-800/30 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-100 dark:hover:border-slate-700'}`}
                                    >
                                        {/* Avatar Dinámico */}
                                        <div className="relative">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner relative z-10 transition-colors
                                                ${selectedCandidate?.id === c.id
                                                    ? 'bg-white/20 text-white dark:text-slate-900 backdrop-blur-md'
                                                    : 'bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300 group-hover:from-indigo-100 dark:group-hover:from-slate-600'}`}
                                            >
                                                {c.name.charAt(0).toUpperCase()}
                                            </div>
                                            {/* Status Indicator Pulse */}
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedCandidate?.id === c.id ? 'bg-green-400' : 'bg-slate-400'}`}></span>
                                                <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white dark:border-slate-800 ${selectedCandidate?.id === c.id ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                            </span>
                                        </div>

                                        {/* Info Text */}
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

                                        {/* Chevron Animado */}
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

            {/* ====================================================================================
                COLUMNA DERECHA: CHAT INMERSIVO
            ==================================================================================== */}
            <div className={`
                flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/50 relative z-10 h-full w-full transition-all duration-500
                ${selectedCandidate ? 'flex translate-x-0' : 'hidden lg:flex lg:translate-x-0'}
            `}>

                {selectedCandidate ? (
                    <>
                        {/* CHAT HEADER: GLASSY & STICKY 
                            FIX: 'pt-10 pb-3' en móvil para que baje el contenido y no se corte con el notch.
                            En desktop 'md:py-0 md:h-24' para mantener el diseño original.
                        */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 md:px-10 z-30 sticky top-0 shadow-sm shrink-0 pt-20 pb-3 md:py-0 md:h-24">

                            <div className="flex items-center gap-5 w-full">
                                {/* BOTÓN VOLVER (MOBILE) */}
                                <button
                                    onClick={handleBackToList}
                                    className="lg:hidden p-3 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform mr-2"
                                >
                                    <ArrowLeft size={22} strokeWidth={3} />
                                </button>

                                {/* Avatar Grande */}
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl ring-4 ring-white dark:ring-slate-900">
                                        {selectedCandidate.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-900 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-black text-slate-900 dark:text-white text-lg md:text-2xl leading-none truncate tracking-tight">
                                            {selectedCandidate.name.replace('.pdf', '').replace('.docx', '')}
                                        </h3>
                                        <span className="hidden md:inline-flex px-2 py-0.5 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                                            AI Twin Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                                        <Radio size={12} className="text-green-500 animate-pulse" />
                                        <span className="truncate">Neural Link Established • 12ms Latency</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MESSAGES AREA */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 relative scroll-smooth">
                            {/* Matrix Pattern Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                            </div>

                            <AnimatePresence initial={false}>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] md:max-w-[70%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                            {/* Iconos de Avatar en el chat */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md mt-auto
                                                ${msg.role === 'user' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                                                {msg.role === 'user' ? <ArrowLeft className="rotate-180" size={18} /> : <Bot size={20} />}
                                            </div>

                                            <div className={`p-6 rounded-[2rem] shadow-xl text-[15px] md:text-base leading-relaxed relative overflow-hidden backdrop-blur-sm
                                                ${msg.role === 'user'
                                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-none'
                                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                                                }`}>
                                                {/* Efecto de brillo en burbujas */}
                                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                                                {msg.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 mt-auto">
                                            <Loader2 size={20} className="animate-spin" />
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 px-6 py-5 rounded-[2rem] rounded-bl-none shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></span>
                                            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce delay-[150ms]"></span>
                                            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce delay-[300ms]"></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {messages.length >= FREE_LIMIT && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center py-10">
                                    <button
                                        onClick={() => navigate('/upgrade')}
                                        className="group relative inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-transform"
                                    >
                                        <div className="relative px-8 py-4 bg-white dark:bg-slate-950 rounded-full flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                <Lock size={18} className="text-slate-900 dark:text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Finalizada</p>
                                                <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                                    Desbloquear Poder Ilimitado ⚡
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </motion.div>
                            )}

                            <div ref={scrollRef} className="h-4" />
                        </div>

                        {/* INPUT AREA FLOTANTE */}
                        <div className="p-6 md:p-8 z-20 shrink-0">
                            <div className="max-w-4xl mx-auto relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                                <form onSubmit={handleSendMessage} className="relative flex items-center bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">

                                    <div className="pl-6 text-slate-400">
                                        <Sparkles size={20} className={loading ? "animate-spin" : ""} />
                                    </div>

                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={messages.length >= FREE_LIMIT || loading}
                                        placeholder={messages.length >= FREE_LIMIT ? "Actualiza para continuar..." : "Haz una pregunta difícil..."}
                                        className="flex-1 bg-transparent text-slate-900 dark:text-white px-4 py-6 outline-none text-base md:text-lg placeholder:text-slate-400"
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading || !input.trim() || messages.length >= FREE_LIMIT}
                                        className="m-2 p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                                    >
                                        <Send size={20} className="ml-0.5" />
                                    </button>
                                </form>
                            </div>
                            <p className="text-center text-[10px] font-mono text-slate-400 mt-4 opacity-60">
                                AI Model: Llama-3.3-70b-versatile • Context Window: 4k tokens
                            </p>
                        </div>
                    </>
                ) : (
                    // --- EMPTY STATE (Desktop) ---
                    <div className="flex-1 hidden lg:flex flex-col items-center justify-center p-8 relative overflow-hidden">
                        {/* Decoración Fondo */}
                        <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/40 dark:bg-slate-900/40 p-12 rounded-[3rem] border border-white/50 dark:border-slate-700/50 text-center max-w-lg backdrop-blur-xl relative z-10 shadow-2xl"
                        >
                            <div className="w-28 h-28 bg-gradient-to-br from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-500/30 transform rotate-3">
                                <BrainCircuit size={56} className="text-white dark:text-slate-900" />
                            </div>

                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                                Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Simulations</span>
                            </h2>

                            <div className="space-y-4 text-left px-4">
                                <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600"><Zap size={20} /></div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Entrevistas en tiempo real</p>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600"><Code2 size={20} /></div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Validación técnica profunda</p>
                                </div>
                            </div>

                            <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest font-bold">
                                Selecciona un perfil para comenzar
                            </p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigitalTwin;