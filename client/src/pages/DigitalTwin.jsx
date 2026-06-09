/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Send, Sparkles } from 'lucide-react';

// --- IMPORTS API Y CONTEXTO ---
import { candidatesAPI } from '../api/candidates';
import { digitalTwinChatWithGroq } from '../api/groqClient';
import { useAuth } from '../context/AuthContext';

// --- IMPORTS COMPONENTES ---
import CandidateList from '../components/digital-twin/CandidateList';
import ChatInterface from '../components/digital-twin/ChatInterface';
import EmptyState from '../components/digital-twin/EmptyState';

const PREMIUM_ROLES = ['Premium', 'Admin', 'Reclutador', 'Agency', 'Agency Pro'];
const FREE_LIMIT = 3;

// ─────────────────────────────────────────────────────────────────────────────
// ChatInput — ISOLATED COMPONENT to prevent message list re-renders on keystroke
// This is the core fix for the re-render bug. By keeping input state local here,
// typing a character ONLY re-renders this small component, not the entire tree.
// ─────────────────────────────────────────────────────────────────────────────
const ChatInput = memo(({ onSubmit, isDisabled, isLimitReached, loading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isDisabled) return;
        onSubmit(input.trim());
        setInput('');
    };

    return (
        <div className="p-6 md:p-8 z-20 shrink-0">
            <div className="max-w-4xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                <form onSubmit={handleSubmit} className="relative flex items-center bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="pl-6 text-slate-400">
                        <Sparkles size={20} className={loading ? 'animate-spin' : ''} />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLimitReached || loading}
                        placeholder={isLimitReached ? 'Límite alcanzado…' : 'Haz una pregunta…'}
                        className="flex-1 bg-transparent text-slate-900 dark:text-white px-4 py-6 outline-none text-base md:text-lg placeholder:text-slate-400"
                    />
                    <button
                        aria-label="Enviar mensaje"
                        type="submit"
                        disabled={loading || !input.trim() || isLimitReached}
                        className="m-2 p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                        <Send size={20} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
});
ChatInput.displayName = 'ChatInput';

// ─────────────────────────────────────────────────────────────────────────────
// Main DigitalTwin page
// ─────────────────────────────────────────────────────────────────────────────
const DigitalTwin = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [clearingMemory, setClearingMemory] = useState(false);
    // userTurnCount tracks how many user messages are saved in DB for the selected candidate
    const [userTurnCount, setUserTurnCount] = useState(0);

    const scrollRef = useRef(null);
    const { user } = useAuth();
    const isPremium = PREMIUM_ROLES.includes(user?.role);

    // Stable: whether the paywall is active
    const isLimitReached = !isPremium && userTurnCount >= FREE_LIMIT;

    // ── Load candidate list ────────────────────────────────────────────────
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await candidatesAPI.getAll();
                if (Array.isArray(data)) setCandidates(data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };
        fetchCandidates();
    }, []);

    // ── Auto-scroll on new messages ───────────────────────────────────────
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // ─────────────────────────────────────────────────────────────────────
    // Premium paywall toast
    // ─────────────────────────────────────────────────────────────────────
    const showPremiumToast = useCallback(() => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'} max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto p-5 relative flex flex-col gap-3`}>
                <div>
                    <div className="text-base font-semibold text-white flex items-center gap-2">
                        <span className="text-yellow-400">✨</span> Función Premium
                    </div>
                    <div className="text-sm text-neutral-400 mt-1">
                        Has alcanzado el límite gratuito ({FREE_LIMIT} consultas en total). Actualiza a Premium para conversaciones ilimitadas.
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    }, []);

    // ─────────────────────────────────────────────────────────────────────
    // Clear Memory logic
    // ─────────────────────────────────────────────────────────────────────
    const executeDeleteMemory = useCallback(async () => {
        if (!selectedCandidate) return;
        setClearingMemory(true);
        const candidateId = selectedCandidate._id || selectedCandidate.id;
        try {
            await candidatesAPI.deleteTwinMemory(candidateId);

            // CRITICAL: Re-fetch the REAL global count from the backend after deletion.
            // Setting userTurnCount to 0 locally would create the "Amnesia Loophole":
            // the user could delete memory to fool isLimitReached into allowing more
            // free queries. The backend's digital_twin_count is unchanged by deletion,
            // so we must sync local state with the authoritative global count.
            const { user_turn_count } = await candidatesAPI.getTwinMemory(candidateId);
            setUserTurnCount(user_turn_count ?? 0);

            setMessages([{
                role: 'assistant',
                content: `Memoria borrada. Soy de nuevo el gemelo digital de ${selectedCandidate.name.replace('.pdf', '')}. ¿En qué puedo ayudarte?`
            }]);
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'} max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto flex items-center p-4 gap-3`}>
                    <span className="text-xl">🗑️</span>
                    <div className="flex-1 text-sm font-medium text-white">Memoria del gemelo borrada</div>
                    <button type="button" onClick={() => toast.dismiss(t.id)} className="text-neutral-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-neutral-800">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ), { duration: 2500 });
        } catch (error) {
            console.error(error);
            toast.error('Error al borrar la memoria');
        } finally {
            setClearingMemory(false);
        }
    }, [selectedCandidate]);

    const handleClearMemory = useCallback(() => {
        if (messages.length <= 1) return;
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'} max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto p-5 relative flex flex-col gap-3`}>
                <div>
                    <div className="text-base font-semibold text-white">¿Borrar memoria del gemelo?</div>
                    <div className="text-sm text-neutral-400">Esta acción borrará todo el historial de esta conversación del gemelo digital.</div>
                </div>
                <div className="flex justify-end gap-2 mt-1">
                    <button type="button" onClick={() => toast.dismiss(t.id)} className="px-3 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors">Cancelar</button>
                    <button type="button" onClick={() => { toast.dismiss(t.id); executeDeleteMemory(); }} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                        <Trash2 size={14} /> Borrar
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    }, [messages.length, executeDeleteMemory]);

    // ─────────────────────────────────────────────────────────────────────
    // Select candidate → hydrate from DB
    // ─────────────────────────────────────────────────────────────────────
    const handleSelectCandidate = async (candidate) => {
        setSelectedCandidate(candidate);
        setLoading(true);
        setMessages([]);
        // Optimistic reset to 0 during loading — will be overwritten by real global
        // count once the API responds. This just prevents stale state from flashing.
        setUserTurnCount(0);

        try {
            const candidateId = candidate._id || candidate.id;
            // Load persisted twin memory from DB. user_turn_count is the GLOBAL
            // digital_twin_count from user_usage — NOT a per-candidate message count.
            const { history, user_turn_count } = await candidatesAPI.getTwinMemory(candidateId);

            // CRITICAL: Always apply the global count from the backend, regardless
            // of whether this candidate has any chat history. Without this fix, a user
            // who exhausted their limit on candidate A could switch to candidate B
            // (empty history → else branch) and get userTurnCount=0 → isLimitReached=false.
            setUserTurnCount(user_turn_count ?? 0);

            if (history && history.length > 0) {
                setMessages(history);
            } else {
                setMessages([{
                    role: 'assistant',
                    content: `Hola. Soy el gemelo digital de ${candidate.name.replace('.pdf', '')}. He procesado mi trayectoria profesional y estoy listo para validar mis competencias técnicas contigo.`
                }]);
            }
        } catch (error) {
            console.error('Error cargando historial del twin', error);
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // Send message — receives plain text string from ChatInput
    // ─────────────────────────────────────────────────────────────────────
    const handleSendMessage = useCallback(async (text) => {
        if (!selectedCandidate) return;

        if (isLimitReached) {
            showPremiumToast();
            return;
        }

        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const candidateID = selectedCandidate._id || selectedCandidate.id;

            // 1. Check paywall first by attempting to save (backend is authoritative)
            //    We do a pre-flight save request with empty assistant to verify limit
            //    Actually: we need to get the AI response first, then save both.
            //    So: call Groq, then save. If save 403s, revert UI.

            // Get full CV text for context
            const fullCandidate = await candidatesAPI.getById(candidateID);
            const cvText = fullCandidate.text || fullCandidate.summary || 'Sin información disponible';

            // Build history for Groq (messages snapshot before this new one)
            const historyForGroq = messages.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
            }));

            // 2. Call Groq browser-side for speed
            const responseText = await digitalTwinChatWithGroq(
                selectedCandidate.name,
                cvText,
                text,
                historyForGroq
            );

            // 3. Persist BOTH messages to MongoDB via backend (authoritative paywall check)
            const saveResult = await candidatesAPI.saveTwinMemory(candidateID, text, responseText);

            // 4. Update userTurnCount from backend's authoritative count
            setUserTurnCount(saveResult.user_turn_count ?? (prev => prev + 1));

            // 5. Show the AI response in UI
            setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);

        } catch (error) {
            console.error('handleSendMessage error:', error);
            // Revert the optimistic user message
            setMessages(prev => prev.slice(0, -1));

            if (error?.status === 403 || error?.message === 'Premium Feature' || error?.message?.toLowerCase().includes('premium')) {
                showPremiumToast();
            } else {
                toast.error('Error conectando con el gemelo digital');
            }
        } finally {
            setLoading(false);
        }
    }, [selectedCandidate, isLimitReached, messages, showPremiumToast]);

    return (
        <div className="size-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans relative flex transition-colors duration-500">
            {/* Estilos para scrollbar custom */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 100vh; transition: all 0.3s ease; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #6366f1, #a855f7); box-shadow: 0 0 10px rgba(168, 85, 247, 0.5); }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(99, 102, 241, 0.3) transparent; }
            `}</style>

            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0"></div>

            <CandidateList
                candidates={candidates}
                selectedCandidate={selectedCandidate}
                onSelect={handleSelectCandidate}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isPremium={isPremium}
            />

            <div className={`flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/50 relative z-10 size-full transition-all duration-500 ${selectedCandidate ? 'flex translate-x-0' : 'hidden lg:flex lg:translate-x-0'}`}>
                {selectedCandidate ? (
                    <ChatInterface
                        candidate={selectedCandidate}
                        messages={messages}
                        // input and setInput are NO LONGER passed — ChatInput manages its own state
                        onSend={handleSendMessage}
                        loading={loading}
                        onBack={() => setSelectedCandidate(null)}
                        scrollRef={scrollRef}
                        isLimitReached={isLimitReached}
                        onClearMemory={handleClearMemory}
                        clearingMemory={clearingMemory}
                        isPremium={isPremium}
                        userTurnCount={userTurnCount}
                        freeLimit={FREE_LIMIT}
                        ChatInputComponent={ChatInput}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default DigitalTwin;