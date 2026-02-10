import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit, UserPlus, ArrowLeft, Mail, Lock, CheckCircle2, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTS API ---
import { authAPI } from '../api/auth';

// --- IMPORTS COMPONENTES ---
import AuthVisuals from '../components/auth/AuthVisuals';
import { InputGroup, PasswordInput } from '../components/auth/AuthInputs';

const Register = () => {
    // --- ESTADOS Y LÓGICA ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState(location.state?.initialView || 'register');

    useEffect(() => {
        if (location.state?.initialView) window.history.replaceState({}, document.title);
    }, []);

    const validatePassword = (pass) => {
        if (pass.length < 6) return "Mínimo 6 caracteres.";
        if (!/[A-Z]/.test(pass)) return "Falta una mayúscula.";
        if (!/\d/.test(pass)) return "Falta un número.";
        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // 1. Validar complejidad
        const errorMsg = validatePassword(password);
        if (errorMsg) return toast.error(errorMsg);

        // 2. Validar coincidencia
        if (password !== confirmPassword) {
            return toast.error("Las contraseñas no coinciden.");
        }

        setLoading(true);
        try {
            await authAPI.register(email, password);
            toast.success("¡Cuenta creada!");
            navigate('/login');
        } catch (error) {
            toast.error(error.message || "Error al registrar cuenta");
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.verifyEmail(email);
            toast.success("Email verificado.");
            setView('forgot_new_pass');
        } catch (error) {
            toast.error(error.message || "Email no encontrado.");
        } finally {
            setLoading(false);
        }
    };

    const handleDirectReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.resetPasswordDirect(email, password);
            toast.success("¡Contraseña actualizada!");
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            toast.error(error.message || "Error al cambiar clave.");
        } finally {
            setLoading(false);
        }
    };

    // --- ANIMACIONES ---
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        // Contenedor principal adaptable
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-300">

            {/* BOTÓN VOLVER */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                    if (view === 'forgot_new_pass') setView('forgot_email');
                    else if (view === 'forgot_email') setView('register');
                    else navigate('/');
                }}
                className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/10 lg:bg-white/10 lg:backdrop-blur-md border border-white/20 text-slate-300 lg:text-white hover:text-white hover:bg-white/20 transition-all shadow-lg group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </motion.button>

            {/* COMPONENTE VISUAL IZQUIERDO */}
            <AuthVisuals />

            {/* --- LADO DERECHO: FORMULARIO --- */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-transparent lg:bg-slate-50 dark:lg:bg-slate-950 relative z-10 transition-colors duration-300"
            >
                <div className="w-full max-w-md space-y-8 relative">

                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center lg:text-left">
                        <div className="inline-flex lg:hidden items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl mb-8 shadow-2xl border border-white/20 ring-1 ring-white/10">
                            <BrainCircuit className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-white lg:text-slate-900 dark:lg:text-white tracking-tight mb-2 drop-shadow-lg lg:drop-shadow-none transition-colors">
                            {view === 'register' ? 'Crear cuenta gratis' : 'Recuperar acceso'}
                        </h2>
                        <p className="text-slate-300 lg:text-slate-500 dark:lg:text-slate-400 text-sm font-medium leading-relaxed transition-colors">
                            {view === 'register'
                                ? 'Empieza a optimizar tu proceso hoy mismo.'
                                : view === 'forgot_new_pass' ? 'Establece tu nueva contraseña segura.' : 'Ingresa tus datos para buscar tu cuenta.'}
                        </p>
                    </motion.div>

                    {/* CARD DEL FORMULARIO */}
                    <div className="
                        bg-white/10 lg:bg-white dark:lg:bg-slate-900
                        backdrop-blur-xl lg:backdrop-blur-none
                        p-8 rounded-[2rem] lg:rounded-3xl
                        shadow-2xl shadow-black/20 lg:shadow-slate-200/50 dark:lg:shadow-none
                        border border-white/20 lg:border-slate-100 dark:lg:border-slate-800
                        relative overflow-hidden min-h-[380px] transition-all duration-300
                    ">
                        {/* Brillo superior en borde (Mobile) */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent lg:hidden"></div>

                        <AnimatePresence mode='wait'>

                            {/* VISTA 1: REGISTRO */}
                            {view === 'register' && (
                                <motion.form
                                    key="register"
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleRegister}
                                    className="space-y-4 relative z-10"
                                >
                                    <InputGroup label="Email Corporativo" icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="nombre@empresa.com" isMobileDark={true} />

                                    <PasswordInput value={password} onChange={setPassword} showValidation={true} isMobileDark={true} />

                                    <PasswordInput
                                        label="Confirmar Contraseña"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        showValidation={false}
                                        isMobileDark={true}
                                        placeholder="Repite tu contraseña"
                                    />

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="
                                            w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 group transition-all mt-4
                                            bg-indigo-600 lg:bg-slate-900 text-white 
                                            shadow-indigo-600/30 lg:shadow-indigo-500/20
                                            hover:bg-indigo-500 lg:hover:bg-indigo-600
                                            
                                            /* Dark Mode Desktop */
                                            dark:lg:bg-white dark:lg:text-slate-900 dark:lg:hover:bg-slate-200
                                        "
                                    >
                                        {loading ? "Creando..." : <><UserPlus size={20} /> Crear Cuenta</>}
                                    </motion.button>
                                </motion.form>
                            )}

                            {/* VISTA 2: EMAIL (FORGOT) */}
                            {view === 'forgot_email' && (
                                <motion.form
                                    key="forgot_email"
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    onSubmit={verifyEmail}
                                    className="space-y-5 relative z-10"
                                >
                                    <div className="p-4 bg-amber-500/20 lg:bg-amber-50 dark:lg:bg-amber-900/10 text-amber-100 lg:text-amber-800 dark:lg:text-amber-200 text-sm rounded-xl border border-amber-500/30 lg:border-amber-100 dark:lg:border-amber-500/20 flex gap-3 backdrop-blur-sm transition-colors">
                                        <HelpCircle className="flex-shrink-0 text-amber-300 lg:text-amber-500 dark:lg:text-amber-400" />
                                        <p>Ingresa el correo asociado a tu cuenta para buscarte en el sistema.</p>
                                    </div>
                                    <InputGroup label="Tu Email" icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="ejemplo@email.com" isMobileDark={true} />

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="
                                            w-full py-4 font-bold rounded-xl shadow-lg transition-all
                                            bg-indigo-600 lg:bg-indigo-600 text-white 
                                            hover:bg-indigo-500 lg:hover:bg-indigo-700
                                            shadow-indigo-600/30 lg:shadow-indigo-500/20
                                            
                                            /* Dark Mode Desktop */
                                            dark:lg:bg-indigo-500 dark:lg:hover:bg-indigo-400
                                        "
                                    >
                                        {loading ? "Buscando..." : "Continuar"}
                                    </motion.button>
                                </motion.form>
                            )}

                            {/* VISTA 3: NUEVA CLAVE */}
                            {view === 'forgot_new_pass' && (
                                <motion.form
                                    key="forgot_new_pass"
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleDirectReset}
                                    className="space-y-5 relative z-10"
                                >
                                    <div className="flex items-center gap-3 p-3 bg-indigo-500/20 lg:bg-indigo-50 dark:lg:bg-indigo-900/20 rounded-xl border border-indigo-500/30 lg:border-indigo-100 dark:lg:border-indigo-500/20 mb-2 backdrop-blur-sm transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/30 lg:bg-indigo-100 dark:lg:bg-indigo-500/20 flex items-center justify-center text-indigo-200 lg:text-indigo-600 dark:lg:text-indigo-300">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-200 lg:text-indigo-500 dark:lg:text-indigo-300 font-bold uppercase">Usuario encontrado</p>
                                            <p className="text-sm font-bold text-white lg:text-indigo-900 dark:lg:text-indigo-100">{email}</p>
                                        </div>
                                    </div>
                                    <PasswordInput label="Nueva Contraseña" value={password} onChange={setPassword} showValidation={true} isMobileDark={true} />

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="
                                            w-full py-4 font-bold rounded-xl shadow-lg transition-all
                                            bg-green-600 hover:bg-green-500 lg:hover:bg-green-700 text-white 
                                            shadow-green-600/30 lg:shadow-green-500/20
                                            
                                            /* Dark Mode Desktop */
                                            dark:lg:bg-emerald-600 dark:lg:hover:bg-emerald-500
                                        "
                                    >
                                        {loading ? "Actualizando..." : "Cambiar Contraseña"}
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* Footer Links */}
                    {view === 'register' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center space-y-4">
                            <p className="text-sm text-slate-400 lg:text-slate-500 dark:lg:text-slate-400 transition-colors">
                                ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} className="text-white lg:text-indigo-600 dark:lg:text-indigo-400 font-bold cursor-pointer hover:underline ml-1">Inicia Sesión</span>
                            </p>
                            <button type="button" onClick={() => setView('forgot_email')} className="text-xs font-medium text-indigo-300 lg:text-slate-400 dark:lg:text-slate-500 hover:text-white lg:hover:text-slate-600 dark:lg:hover:text-slate-300 transition-colors flex items-center justify-center gap-1 mx-auto">
                                <Lock size={12} /> ¿Olvidaste tu contraseña?
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Register;