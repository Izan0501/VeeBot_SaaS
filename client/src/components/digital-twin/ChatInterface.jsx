/* eslint-disable react-doctor/rendering-hydration-mismatch-time */
/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React, { memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Radio, Bot, User, Loader2, Sparkles, Crown, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ChatInterface receives isLimitReached as a boolean (not a function).
// Input state lives inside ChatInputComponent — not here — to prevent re-renders.
const ChatInterface = memo(({
    candidate,
    messages,
    onSend,
    loading,
    onBack,
    scrollRef,
    isLimitReached,        // boolean
    onClearMemory,
    clearingMemory,
    isPremium,
    userTurnCount,
    freeLimit,
    ChatInputComponent,    // pass-in the isolated ChatInput component
}) => {
    const navigate = useNavigate();
    const remaining = Math.max(0, freeLimit - userTurnCount);

    return (
        <>
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 md:px-10 z-30 sticky top-0 shadow-sm shrink-0 pt-20 pb-3 md:py-0 md:h-24">
                <div className="flex items-center gap-5 w-full">
                    <button aria-label="Volver" type="button" onClick={onBack} className="lg:hidden p-3 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform mr-2">
                        <ArrowLeft size={22} strokeWidth={3} />
                    </button>

                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="size-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl ring-4 ring-white dark:ring-slate-900">
                            {candidate.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 size-4 rounded-full border-[3px] border-white dark:border-slate-900 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    </div>

                    {/* Name + status */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-black text-slate-900 dark:text-white text-lg md:text-2xl leading-none truncate tracking-tight">
                                {candidate.name.replace('.pdf', '').replace('.docx', '')}
                            </h3>
                            <span className="hidden md:inline-flex px-2 py-0.5 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                                AI Twin Active
                            </span>
                        </div>
                        {/* Dynamic usage line */}
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-200">
                            <Radio size={12} className="text-green-500 animate-pulse shrink-0" />
                            {isPremium ? (
                                <span className="flex items-center gap-1 truncate">
                                    <Crown size={10} className="text-yellow-400" /> Acceso Ilimitado &bull; Pro
                                </span>
                            ) : (
                                <span className={`truncate ${isLimitReached ? 'text-red-400 font-semibold' : ''}`}>
                                    {isLimitReached
                                        ? '⛔ Límite alcanzado — Actualiza a Premium'
                                        : `${remaining} de ${freeLimit} consultas restantes`}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Clear Memory Trash Button */}
                    <button
                        type="button"
                        onClick={onClearMemory}
                        disabled={clearingMemory || messages.length <= 1}
                        title="Borrar memoria del gemelo"
                        aria-label="Borrar memoria del gemelo digital"
                        className="text-red-700 dark:text-red-300 bg-white/90 dark:bg-slate-800 hover:text-white hover:bg-red-500 dark:hover:bg-red-500 p-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 border border-slate-200/50 dark:border-slate-700/50"
                    >
                        {clearingMemory
                            ? <Loader2 size={18} className="animate-spin" />
                            : <Trash2 size={18} />
                        }
                    </button>
                </div>
            </div>

            {/* ── Message List ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 relative scroll-smooth custom-scrollbar">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <m.div
                            suppressHydrationWarning
                            key={msg.id || `msg-${i}`}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] md:max-w-[70%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 shadow-md mt-auto
                                ${msg.role === 'user' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={20} />}
                                </div>
                                <div className={`p-6 rounded-[2rem] shadow-xl text-[15px] md:text-base leading-relaxed relative overflow-hidden backdrop-blur-sm
                                ${msg.role === 'user'
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                                    }`}>
                                    <div className="absolute top-0 left-0 size-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                                    {msg.content}
                                </div>
                            </div>
                        </m.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                        <div className="flex gap-4">
                            <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 mt-auto">
                                <Loader2 size={20} className="animate-spin" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 px-6 py-5 rounded-[2rem] rounded-bl-none shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                                <span className="size-2.5 bg-indigo-500 rounded-full animate-pulse"></span>
                                <span className="size-2.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                                <span className="size-2.5 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
                            </div>
                        </div>
                    </m.div>
                )}

                <div ref={scrollRef} className="h-4" />
            </div>

            {/* ── Premium Upgrade Banner (shows at limit) ───────────────────── */}
            <AnimatePresence>
                {isLimitReached && (
                    <m.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="px-6 md:px-8 pb-2 z-20 flex justify-center w-full"
                    >
                        <button
                            aria-label="Desbloquear acceso ilimitado"
                            type="button"
                            onClick={() => navigate('/upgrade')}
                            className="relative group w-full md:w-auto overflow-hidden rounded-full p-[3px] focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-all hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.7)] hover:scale-[1.02]"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="relative size-full cursor-pointer inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-medium text-white backdrop-blur-3xl gap-3">
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                <Crown className="size-5 text-yellow-400 fill-yellow-400 animate-[pulse_2s_infinite]" />
                                <span className="text-base font-bold text-indigo-400 dark:text-indigo-400">Desbloquear Poder Ilimitado</span>
                                <Sparkles className="size-4 text-purple-300 group-hover:rotate-12 transition-transform" />
                            </span>
                        </button>
                    </m.div>
                )}
            </AnimatePresence>

            {/* ── Input Area (isolated component — no re-render on keystroke) ─ */}
            {ChatInputComponent && (
                <ChatInputComponent
                    onSubmit={onSend}
                    isDisabled={isLimitReached || loading}
                    isLimitReached={isLimitReached}
                    loading={loading}
                />
            )}
        </>
    );
});

ChatInterface.displayName = 'ChatInterface';
export default ChatInterface;