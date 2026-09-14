import { useState, useEffect, useRef, useMemo, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { candidatesAPI } from '../api/candidates';
import { featuresAPI } from '../api/features';
import { dashboardChatWithGemini } from '../api/geminiClient';
import { useAuth } from '../context/AuthContext';

// ─── Constants (module-scope, never re-created) ───────────────────────────────

const PREMIUM_ROLES = ['Premium', 'Admin', 'Reclutador', 'Agency', 'Agency Pro'];

const CHAT_INITIAL_VALUE = [
    { id: 'init', role: 'ai', text: 'Hola, soy tu asistente de reclutamiento. **¿Qué perfil estás buscando hoy?**' }
];

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const applyPayload = (current, payload) =>
    typeof payload === 'function' ? payload(current) : payload;

const dashboardReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CANDIDATES':        return { ...state, candidates:        applyPayload(state.candidates,        action.payload) };
        case 'SET_SELECTED_LETTER':   return { ...state, selectedLetter:    applyPayload(state.selectedLetter,   action.payload) };
        case 'SET_SEARCH_TERM':       return { ...state, searchTerm:        applyPayload(state.searchTerm,       action.payload) };
        case 'SET_IS_FILTER_MENU_OPEN': return { ...state, isFilterMenuOpen: applyPayload(state.isFilterMenuOpen, action.payload) };
        case 'SET_SHOW_CLEAR_MODAL':  return { ...state, showClearModal:    applyPayload(state.showClearModal,   action.payload) };
        case 'SET_CLEARING':          return { ...state, clearing:          applyPayload(state.clearing,         action.payload) };
        case 'SET_MESSAGES':          return { ...state, messages:          applyPayload(state.messages,         action.payload) };
        case 'SET_USAGE_COUNT':       return { ...state, usageCount:        applyPayload(state.usageCount,       action.payload) };
        case 'SET_CHAT_QUERY':        return { ...state, chatQuery:         applyPayload(state.chatQuery,        action.payload) };
        case 'SET_IS_THINKING':       return { ...state, isThinking:        applyPayload(state.isThinking,       action.payload) };
        case 'SET_PREV_MODAL_OPEN_STATE': return { ...state, prevModalOpenState: applyPayload(state.prevModalOpenState, action.payload) };
        default: return state;
    }
};

// ─── Toast helpers (module-scope, never re-created) ───────────────────────────

const showCustomSuccess = (msg, opts = {}) =>
    toast.custom(
        (t) => (
            <div className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'} max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto flex items-center p-4 gap-3 relative`}>
                <span className="text-xl">✅</span>
                <div className="flex-1 text-sm font-medium text-white">{msg}</div>
                <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="text-neutral-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-neutral-800"
                    aria-label="Close"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        ),
        { duration: 2000, ...opts }
    );

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useDashboard = (isModalOpen) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isPremium = PREMIUM_ROLES.includes(user?.role);

    // ── Refs ────────────────────────────────────────────────────────────────
    const messagesEndRef = useRef(null);
    const filterMenuRef  = useRef(null);
    const mainScrollRef  = useRef(null);
    const tableRef       = useRef(null);
    const prevCandidatesLength = useRef(0);

    // ── State ───────────────────────────────────────────────────────────────
    const [state, dispatch] = useReducer(dashboardReducer, {
        candidates:           [],
        selectedLetter:       'Todos',
        searchTerm:           '',
        isFilterMenuOpen:     false,
        showClearModal:       false,
        clearing:             false,
        messages:             CHAT_INITIAL_VALUE,
        usageCount:           0,
        chatQuery:            '',
        isThinking:           false,
        prevModalOpenState:   isModalOpen,
    });

    const {
        candidates, selectedLetter, searchTerm, isFilterMenuOpen,
        showClearModal, clearing, messages, usageCount,
        chatQuery, isThinking, prevModalOpenState,
    } = state;

    // ── Sync modal close → refresh candidates ───────────────────────────────
    if (isModalOpen !== prevModalOpenState) {
        dispatch({ type: 'SET_PREV_MODAL_OPEN_STATE', payload: isModalOpen });
        if (prevModalOpenState === true && isModalOpen === false) {
            fetchCandidates(); // eslint-disable-line no-use-before-define
            setTimeout(() => showCustomSuccess('Lista de candidatos actualizada'), 0);
        }
    }

    // ── Data fetching ────────────────────────────────────────────────────────
    async function fetchCandidates() {
        try {
            const data = await candidatesAPI.getAll();
            if (Array.isArray(data)) dispatch({ type: 'SET_CANDIDATES', payload: data });
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    }

    // ── Effects ──────────────────────────────────────────────────────────────

    // 1. Mount: load candidates + hydrate MongoDB chat history & usage count
    // eslint-disable-next-line react-doctor/no-initialize-state
    useEffect(() => {
        fetchCandidates();

        const fetchDashboardData = async () => {
            try {
                const data = await featuresAPI.getDashboardHistory();
                if (data.history && data.history.length > 0) {
                    dispatch({ type: 'SET_MESSAGES', payload: data.history });
                }
                if (typeof data.usage_count === 'number') {
                    dispatch({ type: 'SET_USAGE_COUNT', payload: data.usage_count });
                }
            } catch (error) {
                console.error('Error cargando datos del dashboard', error);
            }
        };

        fetchDashboardData();

        if (mainScrollRef.current) mainScrollRef.current.scrollTo(0, 0);
        window.scrollTo(0, 0);

        return () => {
            const timer = setTimeout(() => {}, 0);
            for (let i = 0; i < timer; i++) clearTimeout(i);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 2. Click-outside: close filter menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                dispatch({ type: 'SET_IS_FILTER_MENU_OPEN', payload: false });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 3. Auto-scroll table into view on new candidates
    useEffect(() => {
        let timer;
        const added = candidates.length - prevCandidatesLength.current;
        if (added > 0 && prevCandidatesLength.current > 0) {
            timer = setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
        prevCandidatesLength.current = candidates.length;
        return () => { if (timer) clearTimeout(timer); };
    }, [candidates]);

    // ── Business logic ───────────────────────────────────────────────────────

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!chatQuery.trim()) return;

        const currentQuery = chatQuery;
        const newMsgUser = { id: Date.now(), role: 'user', text: currentQuery };

        dispatch({ type: 'SET_MESSAGES',    payload: prev => [...prev, newMsgUser] });
        dispatch({ type: 'SET_CHAT_QUERY',  payload: '' });
        dispatch({ type: 'SET_IS_THINKING', payload: true });
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

        try {
            // 1. Call Groq browser-side for speed
            const responseText = await dashboardChatWithGemini(currentQuery, candidates);
            const aiText = responseText || 'No pude generar una respuesta.';

            // 2. Persist BOTH turns to MongoDB — backend enforces paywall and returns real count
            const saveResult = await featuresAPI.saveDashboardMessage(currentQuery, aiText);

            // 3. Sync usage count from backend's authoritative response
            dispatch({ type: 'SET_USAGE_COUNT', payload: saveResult.usage_count });

            // 4. Show AI response
            dispatch({ type: 'SET_MESSAGES', payload: prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiText }] });

        } catch (error) {
            console.error('handleAskAI error:', error);
            dispatch({ type: 'SET_MESSAGES', payload: prev => prev.slice(0, -1) });

            const isPremiumError =
                error?.status === 403 ||
                error?.message === 'Premium Feature' ||
                error?.message?.toLowerCase().includes('premium feature');

            if (isPremiumError) {
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'} max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto p-5 relative flex flex-col gap-3`}>
                        <div>
                            <div className="text-base font-semibold text-white flex items-center gap-2">
                                <span className="text-yellow-400">✨</span> Función Premium
                            </div>
                            <div className="text-sm text-neutral-400 mt-1">
                                Has alcanzado el límite gratuito (3 consultas). Actualiza a Premium para acceso ilimitado al asistente de reclutamiento.
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => toast.dismiss(t.id)} className="px-3 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors">Cerrar</button>
                        </div>
                    </div>
                ), { duration: 5000 });
            } else {
                dispatch({ type: 'SET_MESSAGES', payload: prev => [...prev, { id: Date.now() + 1, role: 'ai', text: 'Error de conexión con la IA.' }] });
            }
        } finally {
            dispatch({ type: 'SET_IS_THINKING', payload: false });
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }
    };

    const executeDelete = async (id) => {
        const toastId = toast.loading('Eliminando…');
        try {
            await candidatesAPI.delete(id);
            dispatch({ type: 'SET_CANDIDATES', payload: prev => prev.filter(c => c.id !== id) });
            showCustomSuccess('Candidato eliminado', { id: toastId });
        } catch {
            toast.error('No se pudo eliminar', { id: toastId });
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
                    <button aria-label="Confirmar" type="button" onClick={() => { toast.dismiss(t.id); executeDelete(id); }} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        Borrar
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const handleClearAll = async () => {
        dispatch({ type: 'SET_CLEARING', payload: true });
        const toastId = toast.loading('Vaciando base de datos…');
        try {
            await candidatesAPI.deleteAll();
            dispatch({ type: 'SET_CANDIDATES', payload: [] });
            dispatch({ type: 'SET_MESSAGES', payload: [{ id: 'init', role: 'ai', text: 'Base de datos limpia. ¿Qué buscamos ahora?' }] });
            showCustomSuccess('Candidatos Eliminados', { id: toastId });
            dispatch({ type: 'SET_SHOW_CLEAR_MODAL', payload: false });
        } catch (error) {
            toast.error(error.message || 'Error al vaciar tabla', { id: toastId });
        } finally {
            dispatch({ type: 'SET_CLEARING', payload: false });
        }
    };

    const handleSendEmail = async (candidateId, candidateEmail, type) => {
        if (!isPremium) {
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-leave'} max-w-sm w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl rounded-xl pointer-events-auto flex items-center p-4 gap-3 relative`}>
                    <span className="text-xl">✨</span>
                    <div className="flex-1 text-sm font-medium text-white">Función premium — Actualizá a Pro para enviar correos automáticos.</div>
                    <button type="button" onClick={() => toast.dismiss(t.id)} className="text-neutral-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-neutral-800" aria-label="Close">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ), { duration: 4500 });
            return;
        }

        const toastId = toast.loading('Enviando email…');
        const newStatus = type === 'interview' ? 'Entrevista' : 'Rechazado';
        try {
            await featuresAPI.sendEmail(candidateId, candidateEmail, newStatus, type);
            showCustomSuccess('Email enviado correctamente', { id: toastId });
            fetchCandidates();
        } catch {
            toast.error('Error al enviar email', { id: toastId });
        }
    };

    // ── Memoised derived data ────────────────────────────────────────────────

    const filteredCandidates = useMemo(() => {
        let result = [...candidates];
        if (selectedLetter !== 'Todos') result = result.filter(c => c.name.trim().toUpperCase().startsWith(selectedLetter));
        if (searchTerm) result = result.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.role && c.role.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        result.sort((a, b) => b.score - a.score);
        return result;
    }, [candidates, selectedLetter, searchTerm]);

    const avgScore = useMemo(() => {
        if (candidates.length === 0) return 0;
        const sum = candidates.reduce((acc, c) => acc + (c.score || 0), 0);
        return Math.round(sum / candidates.length);
    }, [candidates]);

    const lowMatchCount = useMemo(() => candidates.filter(c => c.score < 50).length, [candidates]);

    // ── Dispatch helpers (stable identity via dispatch) ──────────────────────
    const setSearchTerm       = (val) => dispatch({ type: 'SET_SEARCH_TERM',         payload: val });
    const setIsFilterMenuOpen = (val) => dispatch({ type: 'SET_IS_FILTER_MENU_OPEN', payload: val });
    const setSelectedLetter   = (val) => dispatch({ type: 'SET_SELECTED_LETTER',     payload: val });
    const setMessages         = (val) => dispatch({ type: 'SET_MESSAGES',            payload: val });
    const setChatQuery        = (val) => dispatch({ type: 'SET_CHAT_QUERY',          payload: val });
    const openClearModal      = ()    => dispatch({ type: 'SET_SHOW_CLEAR_MODAL',    payload: true });
    const closeClearModal     = ()    => dispatch({ type: 'SET_SHOW_CLEAR_MODAL',    payload: false });

    return {
        // State
        candidates, selectedLetter, searchTerm, isFilterMenuOpen,
        showClearModal, clearing, messages, usageCount,
        chatQuery, isThinking,
        // Derived
        filteredCandidates, avgScore, lowMatchCount,
        isPremium, navigate,
        // Refs
        messagesEndRef, filterMenuRef, mainScrollRef, tableRef,
        // Dispatch helpers
        setSearchTerm, setIsFilterMenuOpen, setSelectedLetter,
        setMessages, setChatQuery, openClearModal, closeClearModal,
        // Handlers
        handleAskAI, handleDelete, handleClearAll, handleSendEmail,
    };
};
