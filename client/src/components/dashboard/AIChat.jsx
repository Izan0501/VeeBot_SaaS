import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, Bot, X, Send, Sparkles, Zap, ChevronDown, MessageSquare, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { featuresAPI } from '../../api/features';
import toast from 'react-hot-toast';

const AIChat = ({ isPremium, messages, isThinking, chatQuery, setMessages, setChatQuery, handleAskAI, messagesEndRef, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    // --- LÓGICA DE LÍMITE (NUEVO) ---
    const FREE_LIMIT = 5;
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    // El límite se alcanza si NO es premium Y ha superado los mensajes gratuitos
    const isLimitReached = !isPremium && userMessageCount >= FREE_LIMIT;
    const remainingQueries = Math.max(0, FREE_LIMIT - userMessageCount);


    const handleClearChat = async () => {
        if (messages.length <= 1) return; // No borrar si solo está el saludo inicial

        try {
            await featuresAPI.clearDashboardChat();

            // Reiniciar estado visualmente
            setMessages([
                { id: 'init', role: 'ai', text: 'Historial borrado. **¿En qué puedo ayudarte ahora?**' }
            ]);

            // Limpiar localStorage también
            localStorage.removeItem('dashboard_chat_history');

            toast.success("Chat limpiado");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo limpiar el chat");
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="chat-window"
                            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-[90vw] md:w-[450px] h-[550px] max-h-[70vh] bg-white/90 dark:bg-[#0B0C15]/90 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-[32px] overflow-hidden flex flex-col relative mb-4"
                        >
                            {/* --- HEADER (Z-INDEX AUMENTADO A 40 PARA ESTAR SOBRE EL BLOQUEO) --- */}
                            <div className="flex items-center justify-between p-5 border-b border-slate-100/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                            <Bot size={20} />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">VeeBot AI</h3>
                                        <div className="flex items-center gap-1.5">
                                            <Sparkles size={10} className="text-amber-400" />
                                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                {isPremium ? "Recruiter Assistant Pro" : `Free Plan (${remainingQueries} restantes)`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* --- BOTÓN DE BORRAR --- */}
                                    <button
                                        onClick={handleClearChat}
                                        title="Borrar historial"
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    {/* BOTÓN DE MINIMIZAR*/}
                                    <button
                                        onClick={toggleChat}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 cursor-pointer"
                                    >
                                        <ChevronDown size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* --- CONTENT --- */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth custom-scrollbar bg-slate-50/50 dark:bg-black/20">
                                {messages.map((msg) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${msg.role === 'user'
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-sm'
                                            : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                                            }`}>
                                            <ReactMarkdown
                                                components={{
                                                    strong: ({ node, ...props }) => <span className="font-bold text-indigo-400" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-sm" {...props} />
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </motion.div>
                                ))}

                                {isThinking && (
                                    <div className="flex items-center gap-3 text-slate-400 text-xs pl-2">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                            <Loader2 size={14} className="animate-spin text-indigo-500" />
                                        </div>
                                        <span className="animate-pulse">Analizando candidatos...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* --- PREMIUM LOCK OVERLAY (SOLO SI SE ALCANZA EL LÍMITE) --- */}
                            {isLimitReached && (
                                <div className="absolute inset-0 z-30 bg-slate-50/60 dark:bg-slate-900/80 backdrop-blur-[3px] flex items-end pb-20 justify-center animate-in fade-in duration-500">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-[85%] bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-indigo-100 dark:border-indigo-500/20 text-center relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3 rotate-3">
                                            <Lock className="text-indigo-600 dark:text-indigo-400" size={24} />
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Límite Gratuito Alcanzado</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Has usado tus 5 consultas gratuitas. Actualiza para acceso ilimitado.</p>
                                        <button onClick={() => onNavigate('/upgrade')} className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                            <Crown size={14} /> Desbloquear Ilimitado
                                        </button>
                                    </motion.div>
                                </div>
                            )}

                            {/* --- INPUT AREA --- */}
                            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                <form onSubmit={handleAskAI} className="relative">
                                    <input
                                        type="text"
                                        value={chatQuery}
                                        onChange={(e) => setChatQuery(e.target.value)}
                                        // Placeholder dinámico
                                        placeholder={isLimitReached ? "🔒 Límite alcanzado" : "Ej: Busca un experto en React..."}
                                        className={`w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-indigo-500/50 transition-all ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        // Deshabilitado solo si está pensando o se alcanzó el límite
                                        disabled={isThinking || isLimitReached}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isThinking || !chatQuery.trim() || isLimitReached}
                                        className={`absolute right-2 top-2 p-2 rounded-xl transition-all ${chatQuery.trim() && !isLimitReached
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isThinking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="chat-btn"
                            onClick={toggleChat}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="group relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
                        >
                            {/* Borde Giratorio "Orgasmic" */}
                            <span className="absolute inset-[-3px] rounded-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Botón Principal */}
                            <span className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center border-2 border-white/10 dark:border-slate-900/10">
                                <div className="relative">
                                    <MessageSquare size={28} className="text-white dark:text-slate-900" fill="currentColor" />
                                    {/* Indicador de Notificación si tiene consultas disponibles */}
                                    {!isLimitReached && (
                                        <div className="absolute -top-1 -right-1">
                                            <span className="flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-slate-900 dark:border-white"></span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </span>

                            {/* Tooltip */}
                            <span className="absolute right-full mr-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transform translate-x-2 group-hover:translate-x-0 transition-transform">
                                Hablar con AI Recruiter
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Componente simple para el Loader
const Loader2 = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export default AIChat;