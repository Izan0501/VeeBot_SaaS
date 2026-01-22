import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Check, X, Zap, Crown, Shield, Rocket, Star, Sparkles, Flame, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Upgrade = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // ==============================================================================
    // 🛡️ GUARDIA DE SEGURIDAD (NUEVO)
    // Verifica si el usuario YA es Premium al entrar o volver a esta página.
    // Si ya pagó, lo redirige al Dashboard y borra el historial para que no pueda volver.
    // ==============================================================================
    useEffect(() => {
        const verifyCurrentStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch('http://127.0.0.1:8000/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const user = await res.json();
                    // Si el backend dice que ya es Premium/Agency...
                    if (user.role === 'Premium' || user.role === 'Agency' || user.role === 'Agency Pro') {
                        // ...lo mandamos al dashboard y REEMPLAZAMOS el historial
                        // para que el botón "Atrás" no lo traiga de nuevo aquí.
                        navigate('/dashboard', { replace: true });
                    }
                }
            } catch (error) {
                console.error("Error verificando suscripción", error);
            }
        };

        verifyCurrentStatus();
    }, [navigate]);

    // ==============================================================================
    // 🎧 ESCUCHA DE EVENTOS (MODIFICADO PARA BORRAR HISTORIAL)
    // ==============================================================================
    useEffect(() => {
        const handleLemonEvent = (event) => {
            if (event.data && event.data.event === 'LemonSqueezy.Payment.Success') {
                toast.success("¡Pago exitoso! Actualizando tu cuenta...", {
                    duration: 4000,
                    icon: '🚀'
                });

                // Esperamos un poco y forzamos la salida
                setTimeout(() => {
                    // Usamos replace: true para matar el historial de navegación
                    navigate('/dashboard', { replace: true });
                    // Opcional: Recargar la página para asegurar que el Sidebar se actualice
                    window.location.reload();
                }, 2000);
            }
        };

        window.addEventListener('message', handleLemonEvent);
        return () => window.removeEventListener('message', handleLemonEvent);
    }, [navigate]);

    // ==============================================================================
    // ⚙️ LÓGICA DE PAGO
    // ==============================================================================
    const handleCheckout = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8000/payments/create-checkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Error generando el pago");

            const data = await response.json();
            const checkoutUrl = data.checkout_url;

            if (window.LemonSqueezy) {
                window.LemonSqueezy.Url.Open(checkoutUrl);
            } else {
                window.location.href = checkoutUrl;
            }

        } catch (error) {
            console.error(error);
            toast.error("No se pudo iniciar el pago. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-full w-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans pb-20">

            {/* --- FONDO AMBIENTAL "VIVO" --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-7xl mx-auto px-6 pt-16"
            >
                {/* --- HEADER --- */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-200/50 dark:border-white/10 backdrop-blur-md">
                        <Sparkles size={14} className="fill-current animate-pulse" /> Nivel Profesional
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                        Desata el poder de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 animate-gradient-x">
                            VeeBot Agency
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        Deja de jugar y empieza a reclutar con esteroides. Acceso ilimitado a la IA más potente del mercado.
                    </motion.p>
                </div>

                {/* --- CARD PRINCIPAL --- */}
                <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-24">
                    <div className="relative group">

                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[35px] blur-xl opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative bg-white dark:bg-slate-900 rounded-[32px] p-1 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

                            <div className="relative bg-slate-50/50 dark:bg-black/40 backdrop-blur-xl rounded-[28px] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">

                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-300 to-orange-400 text-slate-900 text-xs font-black px-4 py-1.5 rounded-lg mb-6 uppercase tracking-wider shadow-lg shadow-orange-500/20 transform -rotate-2">
                                        <Crown size={16} fill="black" /> Plan Recomendado
                                    </div>

                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Suscripción Mensual</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Cancela cuando quieras. Sin permanencia.</p>

                                    <div className="flex items-baseline justify-center md:justify-start gap-2 mb-8">
                                        <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">$29</span>
                                        <div className="flex flex-col items-start">
                                            <span className="text-xl font-bold text-slate-400 uppercase">USD</span>
                                            <span className="text-sm text-slate-500">/ mes</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={loading}
                                        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 group/btn relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine" />

                                        {loading ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Rocket size={24} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                                <span>Obtener Acceso Total</span>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-center md:text-left text-slate-400 mt-4 flex items-center justify-center md:justify-start gap-2 opacity-80">
                                        <Shield size={14} className="text-green-500" /> Garantía de satisfacción de 7 días
                                    </p>
                                </div>

                                <div className="hidden md:block w-px h-64 bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                                <div className="flex-1 w-full">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Flame size={20} className="text-orange-500 fill-orange-500" />
                                        Lo que desbloqueas hoy:
                                    </h4>

                                    <ul className="space-y-4">
                                        {[
                                            "Análisis de CVs Ilimitados",
                                            "Chat con Gemelo Digital (Llama 3.3)",
                                            "Ranking Automático de Candidatos",
                                            "Comparador Versus 1vs1",
                                            "Generación de Emails Personalizados",
                                            "Exportación de Base de Datos"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-4 group/item">
                                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                                    <Check size={16} className="text-green-600 dark:text-green-400 stroke-[3px]" />
                                                </div>
                                                <span className="text-slate-700 dark:text-slate-200 font-medium text-sm md:text-base">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- COMPARACIÓN DETALLADA (GLASS) --- */}
                <motion.div variants={itemVariants} className="max-w-5xl mx-auto mb-20">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">¿Por qué actualizar?</h3>
                        <p className="text-slate-500 dark:text-slate-400">La diferencia entre un aficionado y un profesional.</p>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-3 p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <div className="col-span-1 text-xs font-bold uppercase tracking-widest text-slate-400">Característica</div>
                            <div className="col-span-1 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Plan Starter</div>
                            <div className="col-span-1 text-center text-xs font-bold uppercase tracking-widest text-indigo-500">Plan Agency</div>
                        </div>

                        <TableRow feature="Límite de CVs Mensuales" free="5 CVs" pro="Ilimitado" highlight />
                        <TableRow feature="Modelo de Inteligencia Artificial" free="Llama 3 Basic" pro="Llama 3.3 (70B) Turbo" />
                        <TableRow feature="Chat con Gemelo Digital" free="4 mensajes/chat" pro="Conversación Ilimitada" />
                        <TableRow feature="Exportación a Excel/CSV" free={<XIcon />} pro={<CheckIcon />} />
                        <TableRow feature="Análisis Comparativo (Versus)" free={<XIcon />} pro={<CheckIcon />} />
                        <TableRow feature="Soporte Técnico" free="Email (48hs)" pro="Prioritario (WhatsApp)" />
                    </div>
                </motion.div>

                {/* --- TRUST BADGES --- */}
                <motion.div variants={itemVariants} className="text-center opacity-50 pb-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Pagos seguros encriptados SSL</p>
                    <div className="flex justify-center items-center gap-8 grayscale opacity-70">
                        <div className="font-serif text-2xl font-black italic text-slate-400">Visa</div>
                        <div className="font-sans text-xl font-black text-slate-400">Mastercard</div>
                        <div className="font-mono text-xl font-bold text-slate-400">Stripe</div>
                        <div className="font-sans text-xl font-bold text-slate-400">PayPal</div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

// --- SUBCOMPONENTES ---

const TableRow = ({ feature, free, pro, highlight = false }) => (
    <div className={`grid grid-cols-3 p-5 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors items-center ${highlight ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
        <div className="col-span-1 font-medium text-slate-700 dark:text-slate-300 text-sm">{feature}</div>
        <div className="col-span-1 text-center text-slate-500 text-sm font-medium flex justify-center">{free}</div>
        <div className="col-span-1 text-center font-bold text-indigo-600 dark:text-indigo-400 text-sm flex justify-center">{pro}</div>
    </div>
);

const CheckIcon = () => (
    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
        <Check size={14} className="text-green-600 dark:text-green-400" strokeWidth={3} />
    </div>
);

const XIcon = () => (
    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <X size={14} className="text-slate-400" />
    </div>
);

export default Upgrade;