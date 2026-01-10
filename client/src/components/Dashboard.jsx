import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    BarChart3, Trash2, Send, Loader2, Bot, User, UploadCloud, Filter, ChevronDown, Search, X, Lock, Crown, Sparkles, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = ({ isModalOpen, setIsModalOpen, userRole }) => {
    // --- ESTADOS ---
    const [candidates, setCandidates] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const navigate = useNavigate();

    const isPremium = userRole === 'Premium' || userRole === 'Admin' || userRole === 'Reclutador';

    const [messages, setMessages] = useState([
        { id: 'init', role: 'ai', text: 'Hola, soy tu asistente de reclutamiento. **¿Qué perfil estás buscando hoy?**' }
    ]);
    const [chatQuery, setChatQuery] = useState("");
    const [isThinking, setIsThinking] = useState(false);

    // --- REFS ---
    const messagesEndRef = useRef(null);
    const filterMenuRef = useRef(null);
    const mainScrollRef = useRef(null);
    const tableRef = useRef(null);
    const prevModalOpen = useRef(isModalOpen);
    const prevCandidatesLength = useRef(0);

    // --- EFECTOS ---
    useEffect(() => {
        if (mainScrollRef.current) {
            mainScrollRef.current.scrollTo(0, 0);
        }
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (messages.length > 1 || isThinking) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages, isThinking]);

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch('http://127.0.0.1:8000/candidates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCandidates(data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        if (!isModalOpen && !prevModalOpen.current) {
            fetchCandidates();
        }
        if (prevModalOpen.current === true && isModalOpen === false) {
            fetchCandidates();
            toast.success("Lista de candidatos actualizada");
            setTimeout(() => {
                if (tableRef.current) {
                    tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
        prevModalOpen.current = isModalOpen;
    }, [isModalOpen]);

    useEffect(() => {
        if (candidates.length > prevCandidatesLength.current) {
            if (candidates.length - prevCandidatesLength.current > 0) {
                if (prevCandidatesLength.current > 0) {
                    setTimeout(() => {
                        tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        }
        prevCandidatesLength.current = candidates.length;
    }, [candidates]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                setIsFilterMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCandidates = useMemo(() => {
        let result = [...candidates];
        if (selectedLetter !== "Todos") {
            result = result.filter(c => c.name.trim().toUpperCase().startsWith(selectedLetter));
        }
        if (searchTerm) {
            result = result.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.role && c.role.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        result.sort((a, b) => b.score - a.score);
        return result;
    }, [candidates, selectedLetter, searchTerm]);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const executeDelete = async (id) => {
        const toastId = toast.loading("Eliminando...");
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:8000/candidates/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Eliminado", { id: toastId });
                setCandidates(prev => prev.filter(c => c.id !== id));
            } else throw new Error();
        } catch (error) {
            toast.error("Error al eliminar", { id: toastId });
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[250px] dark:text-slate-200">
                <div className="font-medium text-slate-800 dark:text-slate-200">¿Borrar definitivamente?</div>
                <div className="flex gap-3 justify-end">
                    <button onClick={() => toast.dismiss(t.id)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">Cancelar</button>
                    <button onClick={() => { toast.dismiss(t.id); executeDelete(id); }} className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 size={12} /> Borrar</button>
                </div>
            </div>
        ));
    };

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!isPremium) {
            toast.error("Función exclusiva del Plan Agency 🔒", { icon: '🔒', style: { borderRadius: '10px', background: '#333', color: '#fff', }, });
            return;
        }
        if (!chatQuery.trim()) return;
        const currentQuery = chatQuery;
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: currentQuery }]);
        setChatQuery("");
        setIsThinking(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('query', currentQuery);
            const res = await fetch('http://127.0.0.1:8000/analyze', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.status === 401) {
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "⚠️ Sesión expirada." }]);
                return;
            }
            const data = await res.json();
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
        } catch {
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Error de conexión." }]);
        } finally {
            setIsThinking(false);
        }
    };

    // Variantes de Animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

            {/* HEADER */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm transition-colors">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Dashboard de Talento</h2>
                <div className="flex items-center gap-3">
                    {!isPremium && (
                        <button
                            onClick={() => navigate('/settings')}
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all group"
                        >
                            <Sparkles size={12} className="text-yellow-500 group-hover:text-indigo-500" />
                            <span>Mejorar Plan</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
                    >
                        <UploadCloud size={18} />
                        <span className="hidden md:inline">Subir CVs</span>
                    </button>
                </div>
            </header>

            {/* CONTENIDO SCROLLABLE */}
            <div ref={mainScrollRef} className="flex-1 overflow-auto p-4 md:p-8 space-y-8 custom-scrollbar">

                {/* STATS ANIMADOS */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                >
                    <motion.div variants={itemVariants}>
                        <StatCard
                            title="Total Candidatos"
                            value={candidates.length}
                            trend="Base Activa"
                            icon={<User className="text-white" size={20} />}
                            color="bg-indigo-500"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatCard
                            title="Top Talents"
                            value={candidates.filter(c => c.score > 80).length}
                            trend="Match > 80%"
                            icon={<BarChart3 className="text-white" size={20} />}
                            color="bg-emerald-500"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatCard
                            title="Motor IA"
                            value="Llama 3.3"
                            trend="Online"
                            icon={<Bot className="text-white" size={20} />}
                            color="bg-purple-500"
                        />
                    </motion.div>
                </motion.div>

                {/* --- CHAT IA (INTACTO) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px] md:h-[800px] transition-all relative group"
                >
                    {/* ... (Lógica de chat sin cambios) ... */}
                    {!isPremium && (
                        <div className="absolute inset-0 z-10 bg-slate-50/70 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-500">
                            <div className="w-full max-w-xs md:max-w-sm bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl border border-indigo-100 dark:border-indigo-900/50 text-center transform scale-100 animate-in fade-in zoom-in duration-300">
                                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="text-indigo-600 dark:text-indigo-400" size={28} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">IA Bloqueada</h3>
                                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                    Chatea con tus candidatos, obtén análisis profundos y exporta datos con el plan Agency.
                                </p>
                                <button onClick={() => navigate('/settings')} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm md:text-base hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex justify-center items-center gap-2">
                                    <Crown size={16} /> Desbloquear
                                </button>
                                <p className="text-[10px] md:text-xs text-slate-400 mt-4">Cancela cuando quieras.</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur border-b border-slate-100 dark:border-slate-800 p-4 md:p-5 flex items-center gap-4">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl"><Bot className="text-indigo-600 dark:text-indigo-400" size={24} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">VeeBot AI Recruiter</h3>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span></span>
                                <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">Sistema RAG Activo</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%] lg:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-1 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                                        {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-indigo-600 dark:text-indigo-400" />}
                                    </div>
                                    <div className={`p-4 md:p-5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'}`}>
                                        <ReactMarkdown components={{ strong: ({ node, ...props }) => <span className="font-bold text-indigo-700 dark:text-indigo-300" {...props} />, ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />, li: ({ node, ...props }) => <li className="pl-1" {...props} />, p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />, h3: ({ node, ...props }) => <h3 className="text-base md:text-lg font-bold mt-2 mb-1" {...props} /> }}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center"><Loader2 size={16} className="text-indigo-600 animate-spin" /></div>
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 md:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
                        <form onSubmit={handleAskAI} className="relative flex items-center gap-3">
                            <input type="text" value={chatQuery} onChange={(e) => setChatQuery(e.target.value)} placeholder={isPremium ? "Ej: ¿Quién sabe React y vive en CABA?" : "🔒 Desbloquea para chatear con la IA"} className={`flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm md:text-base rounded-xl py-3 md:py-4 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500 ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isThinking || !isPremium} />
                            <button type="submit" disabled={isThinking || !chatQuery.trim() || !isPremium} className={`bg-indigo-600 text-white p-3 md:p-4 rounded-xl transition-all shadow-md transform ${!isPremium ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-lg active:scale-95'}`}>
                                {isPremium ? <Send size={20} /> : <Lock size={20} />}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* --- SECCIÓN DE CANDIDATOS (TABLA) --- */}
                <motion.div
                    ref={tableRef}
                    className="space-y-4 pt-4 scroll-mt-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between transition-colors">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Buscar por nombre o rol..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400" />
                            {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
                        </div>
                        <div className="relative w-full md:w-auto" ref={filterMenuRef}>
                            <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className={`w-full md:w-auto flex items-center justify-between md:justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isFilterMenuOpen || selectedLetter !== "Todos" ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                <span className="flex items-center gap-2"><Filter size={16} />{selectedLetter === "Todos" ? "Filtrar por Letra" : `Letra: ${selectedLetter}`}</span><ChevronDown size={16} className={`transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isFilterMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-full md:w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in duration-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Selecciona inicial</span>
                                        {selectedLetter !== "Todos" && <button onClick={() => { setSelectedLetter("Todos"); setIsFilterMenuOpen(false); }} className="text-xs text-red-500 hover:text-red-400 font-medium">Limpiar</button>}
                                    </div>
                                    <div className="grid grid-cols-6 gap-2">
                                        {alphabet.map((letter) => (
                                            <button key={letter} onClick={() => { setSelectedLetter(letter); setIsFilterMenuOpen(false); }} className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${selectedLetter === letter ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-600 hover:text-indigo-600'}`}>{letter}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                        <div className="hidden min-[1050px]:block overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                                    <tr><th className="px-6 py-4">Candidato</th><th className="px-6 py-4">Match IA</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4">Fecha</th><th className="px-6 py-4 text-right">Acciones</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {filteredCandidates.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">No se encontraron resultados.</td></tr>
                                    ) : (
                                        filteredCandidates.map((c) => (
                                            <tr key={c.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">{c.name.charAt(0).toUpperCase()}</div>
                                                        <div><p className="font-bold text-slate-800 dark:text-slate-200">{c.name}</p><p className="text-xs text-slate-400 font-medium">{c.role || "Sin rol detectado"}</p></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3"><span className={`text-sm font-bold ${c.score >= 80 ? 'text-green-600 dark:text-green-400' : c.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400'}`}>{c.score}%</span><div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c.score >= 80 ? 'bg-green-500' : c.score >= 50 ? 'bg-yellow-400' : 'bg-slate-300 dark:bg-slate-600'}`} style={{ width: `${c.score}%` }}></div></div></div>
                                                </td>
                                                <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                                                <td className="px-6 py-4 text-slate-400 font-medium text-xs">{c.date || "Reciente"}</td>
                                                <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(c.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"><Trash2 size={18} /></button></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="min-[1050px]:hidden p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                            {filteredCandidates.map((c) => (
                                <div key={c.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                                    <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900">{c.name.charAt(0).toUpperCase()}</div><div><h4 className="font-bold text-slate-800 dark:text-slate-200">{c.name}</h4><p className="text-xs text-slate-500">{c.role || "Sin rol"}</p></div></div><StatusBadge status={c.status} /></div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800"><div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">Match IA</span><div className="flex items-center gap-2"><span className={`font-bold ${c.score >= 80 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{c.score}%</span><div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${c.score >= 80 ? 'bg-green-500' : 'bg-yellow-400'}`} style={{ width: `${c.score}%` }}></div></div></div></div><button onClick={() => handleDelete(c.id)} className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30"><Trash2 size={14} /> Eliminar</button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center text-xs text-slate-400 pt-2">Mostrando {filteredCandidates.length} candidatos ordenados por relevancia.</div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, trend, icon, color }) => (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2.5 rounded-xl ${color} shadow-lg shadow-indigo-500/20`}>{icon}</div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50">
                <ArrowUpRight size={10} className="text-green-600 dark:text-green-400" />
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">{trend}</span>
            </div>
        </div>
        <div>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{title}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    let styles = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    if (status && status.includes('Alto')) styles = 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50';
    else if (status && status.includes('Medio')) styles = 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50';
    else if (status && status.includes('Rechazado')) styles = 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50';
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles}`}>{status || "Pendiente"}</span>;
};

export default Dashboard;