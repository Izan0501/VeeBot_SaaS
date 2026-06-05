import React, { useState, useEffect, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// --- IMPORTS API Y CONTEXTO ---
import { candidatesAPI } from '../api/candidates';
import { featuresAPI } from '../api/features';
import { dashboardChatWithGroq } from '../api/groqClient';
import { useAuth } from '../context/AuthContext';

// --- IMPORTS COMPONENTES ---
import ClearModal from '../components/dashboard/ClearModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsGrid from '../components/dashboard/StatsGrid';
import CandidatesTable from '../components/dashboard/CandidatesTable';
import AIChat from '../components/dashboard/AIChat'; // El componente flotante
import { Trash2 } from 'lucide-react';

const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const CustomToast = ({ t, message, icon }) => (
    <div
        className={`${
            t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
        } max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto flex items-center p-4 gap-3 relative`}
    >
        {icon && <span className="text-xl">{icon}</span>}
        <div className="flex-1 text-sm font-medium text-white">
            {message}
        </div>
        <button
            onClick={() => toast.dismiss(t.id)}
            className="text-neutral-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-neutral-800"
            aria-label="Close"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

const showCustomSuccess = (msg, opts = {}) => toast.custom((t) => <CustomToast t={t} message={msg} icon="✅" />, { duration: 2000, ...opts });

const initialValue = [
    { id: 'init', role: 'ai', text: 'Hola, soy tu asistente de reclutamiento. **¿Qué perfil estás buscando hoy?**' }
];

const Dashboard = ({ isModalOpen, setIsModalOpen }) => {
    // 1. Estados Principales
    const [candidates, setCandidates] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearing, setClearing] = useState(false);
    
    // --- ESTADOS DEL CHAT & LÍMITES ---
    const [messages, setMessages] = useState(initialValue);
    const [usageCount, setUsageCount] = useState(0); // <--- Nuevo Estado para el Límite
    const [chatQuery, setChatQuery] = useState("");
    const [isThinking, setIsThinking] = useState(false);

    const [prevModalOpenState, setPrevModalOpenState] = useState(isModalOpen);
    
    if (isModalOpen !== prevModalOpenState) {
        setPrevModalOpenState(isModalOpen);
        if (prevModalOpenState === true && isModalOpen === false) {
            fetchCandidates();
            setTimeout(() => {
                showCustomSuccess("Lista de candidatos actualizada");
            }, 0);
        }
    }

    // Refs
    const messagesEndRef = useRef(null);
    const filterMenuRef = useRef(null);
    const mainScrollRef = useRef(null);
    const tableRef = useRef(null);
    const prevCandidatesLength = useRef(0);

    const navigate = useNavigate();
    const { user } = useAuth(); 
    const isPremium = user?.isPremium;

    // --- DATA FETCHING (CANDIDATOS) ---
    const fetchCandidates = async () => {
        try {
            const data = await candidatesAPI.getAll();
            if (Array.isArray(data)) setCandidates(data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    // --- EFECTOS ---

    // 1. Cargar Historial y Uso al montar
    // eslint-disable-next-line react-doctor/no-initialize-state
    useEffect(() => {
        fetchCandidates();
        
        const fetchDashboardData = async () => {
            try {
                // Pasamos el ID especial para el historial del dashboard
                const data = await featuresAPI.getDashboardHistory("DASHBOARD_ASSISTANT");

            } catch (error) {
                console.error("Error cargando datos del dashboard", error);
            }
        };
        
        fetchDashboardData();
        
        // Scroll top inicial
        if (mainScrollRef.current) mainScrollRef.current.scrollTo(0, 0);
        window.scrollTo(0, 0);
        
        return () => {
            // Clean up the timer when the component unmounts
            const timer = setTimeout(() => {}, 0);
            for (let i = 0; i < timer; i++) clearTimeout(i);
        };
    }, []);

    // Chat scroll removed from useEffect and moved to handleAskAI and fetchDashboardData

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
        let timer;
        if (candidates.length > prevCandidatesLength.current && candidates.length - prevCandidatesLength.current > 0 && prevCandidatesLength.current > 0) {
            timer = setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
        prevCandidatesLength.current = candidates.length;
        return () => { if (timer) clearTimeout(timer); };
    }, [candidates]);


    // --- LÓGICA DE NEGOCIO ---

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!chatQuery.trim()) return;
        
        const currentQuery = chatQuery;
        const newMsgUser = { id: Date.now(), role: 'user', text: currentQuery };
        
        setMessages(prev => [...prev, newMsgUser]);
        setUsageCount(prev => prev + 1);
        setChatQuery("");
        setIsThinking(true);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
        
        try {
            // Llamada directa a Groq desde el browser — sin pasar por Docker
            const responseText = await dashboardChatWithGroq(currentQuery, candidates);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: responseText || "No pude generar una respuesta." }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "Error de conexión con la IA." }]);
        } finally {
            setIsThinking(false);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
        }
    };

    const executeDelete = async (id) => {
        const toastId = toast.loading("Eliminando…");
        try {
            await candidatesAPI.delete(id);
            setCandidates(prev => prev.filter(c => c.id !== id));
            showCustomSuccess("Candidato eliminado", { id: toastId });
        } catch (error) {
            toast.error("No se pudo eliminar", { id: toastId });
        }
    };

    const handleDelete = (id) => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'} max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto p-5 relative flex flex-col gap-3`}>
                <div>
                    <div className="text-base font-semibold text-white">¿Borrar definitivamente?</div>
                    <div className="text-sm text-neutral-400">Esta acción no se puede deshacer.</div>
                </div>
                <div className="flex justify-end gap-2 mt-1">
                    <button aria-label="Cancelar" type="button" onClick={() => toast.dismiss(t.id)} className="px-3 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors">Cancelar</button>
                    <button aria-label="Confirmar" type="button" onClick={() => { toast.dismiss(t.id); executeDelete(id); }} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={14} /> Borrar</button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const handleClearAll = async () => {
        setClearing(true);
        const toastId = toast.loading("Vaciando base de datos…");
        try {
            await candidatesAPI.deleteAll();
            setCandidates([]);
            
            // También limpiamos el chat visualmente, pero NO el límite de uso
            setMessages([{ id: 'init', role: 'ai', text: 'Base de datos limpia. ¿Qué buscamos ahora?' }]);
            // Opcional: Llamar a clearDashboardChat si quieres limpiar el historial de IA también
            
            showCustomSuccess("Candidatos Eliminados", { id: toastId });
            setShowClearModal(false);
        } catch (error) {
            toast.error(error.message || "Error al vaciar tabla", { id: toastId });
        } finally {
            setClearing(false);
        }
    };

    const handleSendEmail = async (candidateId, candidateEmail, type) => {
        if (!isPremium) {
            toast.custom((t) => <CustomToast t={t} message="Función premium — Actualizá a Pro para enviar correos automáticos." icon="✨" />, {
                duration: 4500,
            });
            return;
        }
        
        const toastId = toast.loading(`Enviando email…`);
        const newStatus = type === 'interview' ? 'Entrevista' : 'Rechazado';
        try {
            await featuresAPI.sendEmail(candidateId, candidateEmail, newStatus, type);
            showCustomSuccess("Email enviado correctamente", { id: toastId });
            fetchCandidates();
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

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
            <ClearModal isOpen={showClearModal} onClose={() => setShowClearModal(false)} onConfirm={handleClearAll} isClearing={clearing} count={candidates.length} />
            
            <DashboardHeader 
                candidatesCount={candidates.length} 
                onOpenClearModal={() => setShowClearModal(true)} 
                isPremium={isPremium} 
                onNavigate={navigate} 
            />
            
            <div ref={mainScrollRef} className="flex-1 overflow-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                <StatsGrid variants={{ container: containerVariants, item: itemVariants }} candidates={candidates} avgScore={avgScore} lowMatchCount={lowMatchCount} />
                
                <CandidatesTable 
                    searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
                    filterMenuRef={filterMenuRef} isFilterMenuOpen={isFilterMenuOpen} setIsFilterMenuOpen={setIsFilterMenuOpen}
                    selectedLetter={selectedLetter} setSelectedLetter={setSelectedLetter}
                    filteredCandidates={filteredCandidates} alphabet={alphabet}
                    handleSendEmail={handleSendEmail} handleDelete={handleDelete}
                    ref={tableRef} 
                />
            </div>

            {/* --- COMPONENTE FLOTANTE --- */}
            {/* Pasamos 'usageCount' y 'setMessages' para la lógica completa */}
            <AIChat 
                isPremium={isPremium} 
                messages={messages} 
                setMessages={setMessages}
                usageCount={usageCount}
                isThinking={isThinking} 
                chatQuery={chatQuery} 
                setChatQuery={setChatQuery} 
                handleAskAI={handleAskAI} 
                messagesEndRef={messagesEndRef} 
                onNavigate={navigate} 
            />
        </div>
    );
};

export default Dashboard;