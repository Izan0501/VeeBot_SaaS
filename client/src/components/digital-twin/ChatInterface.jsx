import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Radio, Bot, User, Loader2, Sparkles, Send, Crown } from 'lucide-react'; // <--- AGREGADO CROWN
import { useNavigate } from 'react-router-dom';

const ChatInterface = ({
    candidate,
    messages,
    input,
    setInput,
    onSend,
    loading,
    onBack,
    scrollRef,
    isLimitReached
}) => {

    const navigate = useNavigate();

    return (
        <>
            {/* Header Chat */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 md:px-10 z-30 sticky top-0 shadow-sm shrink-0 pt-20 pb-3 md:py-0 md:h-24">
                <div className="flex items-center gap-5 w-full">
                    <button onClick={onBack} className="lg:hidden p-3 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform mr-2">
                        <ArrowLeft size={22} strokeWidth={3} />
                    </button>

                    <div className="relative shrink-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl ring-4 ring-white dark:ring-slate-900">
                            {candidate.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-900 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-black text-slate-900 dark:text-white text-lg md:text-2xl leading-none truncate tracking-tight">
                                {candidate.name.replace('.pdf', '').replace('.docx', '')}
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

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 relative scroll-smooth custom-scrollbar">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

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
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md mt-auto
                                ${msg.role === 'user' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={20} />}
                                </div>
                                <div className={`p-6 rounded-[2rem] shadow-xl text-[15px] md:text-base leading-relaxed relative overflow-hidden backdrop-blur-sm
                                ${msg.role === 'user'
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                                    }`}>
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

                <div ref={scrollRef} className="h-4" />
            </div>

            {/* --- SECCIÓN BOTÓN ULTRA PREMIUM (Se muestra al alcanzar límite) --- */}
            <AnimatePresence>
                {isLimitReached() && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="px-6 md:px-8 pb-2 z-20 flex justify-center w-full"
                    >
                        <button
                            onClick={() => navigate('/upgrade')} // O tu lógica de navegación
                            className="relative group w-full md:w-auto overflow-hidden rounded-full p-[3px] focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-all hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.7)] hover:scale-[1.02]"
                        >
                            {/* Animación de Borde Cónico */}
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

                            {/* Contenido del Botón */}
                            <span className="relative h-full w-full cursor-pointer inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-medium text-white backdrop-blur-3xl gap-3">
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-[pulse_2s_infinite]" />
                                <span className="text-base font-bold bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-indigo-200 group-hover:to-white transition-all">
                                    Desbloquear Poder Ilimitado
                                </span>
                                <Sparkles className="w-4 h-4 text-purple-300 group-hover:rotate-12 transition-transform" />
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* ----------------------------------------------------------------- */}

            {/* Input Area */}
            <div className="p-6 md:p-8 z-20 shrink-0">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
                    <form onSubmit={onSend} className="relative flex items-center bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="pl-6 text-slate-400">
                            <Sparkles size={20} className={loading ? "animate-spin" : ""} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLimitReached() || loading}
                            placeholder={isLimitReached() ? "Límite alcanzado..." : "Haz una pregunta..."}
                            className="flex-1 bg-transparent text-slate-900 dark:text-white px-4 py-6 outline-none text-base md:text-lg placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim() || isLimitReached()}
                            className="m-2 p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                        >
                            <Send size={20} className="ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChatInterface;