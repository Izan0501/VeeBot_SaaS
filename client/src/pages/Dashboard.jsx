import React, { useState, useEffect, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// --- IMPORTS API Y CONTEXTO ---
import { candidatesAPI } from '../api/candidates';
import { featuresAPI } from '../api/features';
import { useAuth } from '../context/AuthContext';

// --- IMPORTS COMPONENTES ---
import ClearModal from '../components/dashboard/ClearModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsGrid from '../components/dashboard/StatsGrid';
import CandidatesTable from '../components/dashboard/CandidatesTable';
import AIChat from '../components/dashboard/AIChat';
import { Trash2 } from 'lucide-react';

const Dashboard = ({ isModalOpen, setIsModalOpen }) => {
    // 1. Estados
    const [candidates, setCandidates] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearing, setClearing] = useState(false);

    // --- CHAT STATE CON PERSISTENCIA ---
    const [messages, setMessages] = useState([
        { id: 'init', role: 'ai', text: 'Hola, soy tu asistente de reclutamiento. **¿Qué perfil estás buscando hoy?**' }
    ]);

    // Guardar en localStorage cada vez que cambien los mensajes
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await featuresAPI.getDashboardHistory();
                if (history && history.length > 0) {
                    // Combinamos mensaje inicial con el historial traído
                    setMessages([
                        { id: 'init', role: 'ai', text: 'Hola, soy tu asistente de reclutamiento. **¿Qué perfil estás buscando hoy?**' },
                        ...history
                    ]);
                }
            } catch (error) {
                console.error("Error cargando historial del dashboard", error);
            }
        };
        loadHistory();
    }, []);

    const [chatQuery, setChatQuery] = useState("");
    const [isThinking, setIsThinking] = useState(false);

    // Refs
    const messagesEndRef = useRef(null);
    const filterMenuRef = useRef(null);
    const mainScrollRef = useRef(null);
    const tableRef = useRef(null);
    const prevModalOpen = useRef(isModalOpen);
    const prevCandidatesLength = useRef(0);

    const navigate = useNavigate();
    const { user } = useAuth();
    const isPremium = user?.isPremium;

    // --- EFECTOS GENERALES ---
    useEffect(() => {
        if (mainScrollRef.current) mainScrollRef.current.scrollTo(0, 0);
        window.scrollTo(0, 0);
    }, []);

    // Chat scroll automático
    useEffect(() => {
        if (messages.length > 1 || isThinking) messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages, isThinking]);

    // Click outside filter
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) setIsFilterMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-scroll on new candidates
    useEffect(() => {
        if (candidates.length > prevCandidatesLength.current && candidates.length - prevCandidatesLength.current > 0 && prevCandidatesLength.current > 0) {
            setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
        prevCandidatesLength.current = candidates.length;
    }, [candidates]);



    // --- DATA FETCHING (API) ---
    const fetchCandidates = async () => {
        try {
            const data = await candidatesAPI.getAll();
            if (Array.isArray(data)) setCandidates(data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    useEffect(() => {
        if (!isModalOpen && !prevModalOpen.current) fetchCandidates();
        if (prevModalOpen.current === true && isModalOpen === false) {
            fetchCandidates();
            toast.success("Lista de candidatos actualizada");
            setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
        }
        prevModalOpen.current = isModalOpen;
    }, [isModalOpen]);

    // --- LÓGICA DE NEGOCIO ---
    const executeDelete = async (id) => {
        const toastId = toast.loading("Eliminando...");
        try {
            await candidatesAPI.delete(id);
            setCandidates(prev => prev.filter(c => c.id !== id));
            toast.success("Candidato eliminado", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar", { id: toastId });
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

    const handleClearAll = async () => {
        setClearing(true);
        const toastId = toast.loading("Vaciando base de datos...");
        try {
            await candidatesAPI.deleteAll();
            setCandidates([]);
            // También limpiamos el chat al borrar todo
            setMessages([{ id: 'init', role: 'ai', text: 'Base de datos limpia. ¿Qué buscamos ahora?' }]);
            localStorage.removeItem('dashboard_chat_history');

            toast.success("Candidatos Eliminados", { id: toastId });
            setShowClearModal(false);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error al vaciar tabla", { id: toastId });
        } finally {
            setClearing(false);
        }
    };

    const handleAskAI = async (e) => {
        e.preventDefault();

        if (!chatQuery.trim()) return;

        const currentQuery = chatQuery;

        // 1. Agregamos el mensaje del usuario (Optimistic UI)
        const newMsgUser = { id: Date.now(), role: 'user', text: currentQuery };
        setMessages(prev => [...prev, newMsgUser]);

        setChatQuery("");
        setIsThinking(true);

        try {
            // La API ahora se encarga de verificar si te pasaste de los 5 mensajes
            const data = await featuresAPI.analyzeChat(currentQuery);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: data.response }]);
        } catch (error) {
            console.error(error);

            // Si el backend nos dice "Límite alcanzado", borramos el mensaje del usuario para que no cuente visualmente
            if (error.message && error.message.includes("Límite")) {
                toast.error(error.message, { icon: '🔒' });
                setMessages(prev => prev.filter(m => m.id !== newMsgUser.id));
            } else {
                const msg = error.message === 'Sesión expirada' ? "⚠️ Sesión expirada." : "Error de conexión.";
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: msg }]);
            }
        } finally {
            setIsThinking(false);
        }
    };

    const handleSendEmail = async (candidateId, type) => {
        if (!isPremium) return toast.error("Función Premium 🔒");
        const toastId = toast.loading(`Enviando email...`);
        try {
            await featuresAPI.sendEmail(candidateId, type);
            toast.success("Email enviado correctamente", { id: toastId });
        } catch (error) {
            toast.error("Error al enviar email", { id: toastId });
        }
    };

    // --- CALCULOS MEMOIZADOS ---
    const filteredCandidates = useMemo(() => {
        let result = [...candidates];
        if (selectedLetter !== "Todos") result = result.filter(c => c.name.trim().toUpperCase().startsWith(selectedLetter));
        if (searchTerm) result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.role && c.role.toLowerCase().includes(searchTerm.toLowerCase())));
        result.sort((a, b) => b.score - a.score);
        return result;
    }, [candidates, selectedLetter, searchTerm]);

    const avgScore = useMemo(() => {
        if (candidates.length === 0) return 0;
        const sum = candidates.reduce((acc, c) => acc + (c.score || 0), 0);
        return Math.round(sum / candidates.length);
    }, [candidates]);

    const lowMatchCount = useMemo(() => candidates.filter(c => c.score < 50).length, [candidates]);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // --- RENDER ---
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
            <ClearModal isOpen={showClearModal} onClose={() => setShowClearModal(false)} onConfirm={handleClearAll} isClearing={clearing} count={candidates.length} />
            <DashboardHeader candidatesCount={candidates.length} onOpenClearModal={() => setShowClearModal(true)} isPremium={isPremium} onNavigate={navigate} onOpenUploadModal={() => setIsModalOpen(true)} />

            <div ref={mainScrollRef} className="flex-1 overflow-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                <StatsGrid variants={{ container: containerVariants, item: itemVariants }} candidates={candidates} avgScore={avgScore} lowMatchCount={lowMatchCount} />

                {/* NOTA: Eliminamos el AIChat estático de aquí */}

                <CandidatesTable
                    searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                    filterMenuRef={filterMenuRef} isFilterMenuOpen={isFilterMenuOpen} setIsFilterMenuOpen={setIsFilterMenuOpen}
                    selectedLetter={selectedLetter} setSelectedLetter={setSelectedLetter}
                    filteredCandidates={filteredCandidates} alphabet={alphabet}
                    handleSendEmail={handleSendEmail} handleDelete={handleDelete}
                    ref={tableRef}
                />
            </div>

            {/* --- COMPONENTE FLOTANTE AQUÍ (Fuera del scroll area) --- */}
            <AIChat
                isPremium={isPremium}
                messages={messages}
                isThinking={isThinking}
                chatQuery={chatQuery}
                setMessages={setMessages}
                setChatQuery={setChatQuery}
                handleAskAI={handleAskAI}
                messagesEndRef={messagesEndRef}
                onNavigate={navigate}
            />
        </div>
    );
};

export default Dashboard;