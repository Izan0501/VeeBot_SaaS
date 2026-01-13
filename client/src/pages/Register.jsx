import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    BrainCircuit, UserPlus, ArrowLeft, Mail, Lock, KeyRound,
    CheckCircle2, HelpCircle, ArrowRight, Star, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    // --- ESTADOS Y LÓGICA ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // <--- NUEVO ESTADO
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

        // 2. Validar coincidencia (NUEVO)
        if (password !== confirmPassword) {
            return toast.error("Las contraseñas no coinciden.");
        }

        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("¡Cuenta creada!");
                navigate('/login');
            } else { toast.error(data.detail || "Error"); }
        } catch { toast.error("Error de conexión"); } finally { setLoading(false); }
    };

    const verifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) { toast.success("Email verificado."); setView('forgot_new_pass'); }
            else { toast.error("Email no encontrado."); }
        } catch { toast.error("Error de conexión"); } finally { setLoading(false); }
    };

    const handleDirectReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/auth/reset-password-direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, new_password: password })
            });
            if (res.ok) { toast.success("¡Listo!"); setTimeout(() => navigate('/login'), 1500); }
            else { toast.error("Error al cambiar clave."); }
        } catch { toast.error("Error de conexión"); } finally { setLoading(false); }
    };

    // --- ANIMACIONES ---
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };
    const slideUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans overflow-hidden selection:bg-indigo-500 selection:text-white">

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

            {/* --- FONDO ANIMADO MÓVIL (Solo visible en lg:hidden) --- */}
            <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-slate-900"></div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-[20%] -left-[20%] w-[150vw] h-[150vw] bg-indigo-600/30 rounded-full blur-[80px]"
                ></motion.div>
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-[20%] -right-[20%] w-[150vw] h-[150vw] bg-purple-600/20 rounded-full blur-[80px]"
                ></motion.div>
            </div>

            {/* --- LADO IZQUIERDO: ARTE DESKTOP (ANILLOS CON PULSO) --- */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex w-1/2 bg-slate-950 relative flex-col justify-between p-16 overflow-hidden"
            >
                {/* Anillo Exterior */}
                <motion.div
                    initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 0.1 }}
                    animate={{
                        x: "-50%", y: "-50%",
                        scale: [1, 1.15, 1],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                    className="absolute top-1/2 left-1/2 w-[700px] h-[700px] border-2 border-white/10 rounded-full pointer-events-none"
                />

                {/* Anillo Interior */}
                <motion.div
                    initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 0.2 }}
                    animate={{
                        x: "-50%", y: "-50%",
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: 1.5,
                        delay: 0.1,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                    className="absolute top-1/2 left-1/2 w-[550px] h-[550px] border-[3px] border-indigo-500/30 rounded-full pointer-events-none shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                />

                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none"
                ></motion.div>

                {/* Contenido Texto */}
                <div className="relative z-10 mt-10">
                    <motion.div variants={slideUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <Star size={12} className="fill-indigo-300" /> Únete a los líderes
                    </motion.div>

                    <motion.h1 variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                        El futuro del <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x">Reclutamiento.</span>
                    </motion.h1>

                    <motion.p variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Deja de leer CVs manualmente. Únete a miles de reclutadores que usan VeeBot para encontrar el talento oculto en segundos.
                    </motion.p>
                </div>

                <div className="relative z-10 space-y-4">
                    {["Análisis semántico con IA", "Filtrado automático", "Seguridad Enterprise"].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="flex items-center gap-3 text-slate-300"
                        >
                            <div className="p-1 rounded-full bg-green-500/20 text-green-400"><CheckCircle2 size={16} /></div>
                            <span className="text-sm font-medium">{item}</span>
                        </motion.div>
                    ))}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="relative z-10 text-xs text-slate-600">
                    © {new Date().getFullYear()} VeeBot Inc. Todos los derechos reservados.
                </motion.div>
            </motion.div>

            {/* --- LADO DERECHO: FORMULARIO (Adaptado Mobile Premium) --- */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-transparent lg:bg-slate-50 relative z-10"
            >
                <div className="w-full max-w-md space-y-8 relative">

                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center lg:text-left">
                        <div className="inline-flex lg:hidden items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl mb-8 shadow-2xl border border-white/20 ring-1 ring-white/10">
                            <BrainCircuit className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-white lg:text-slate-900 tracking-tight mb-2 drop-shadow-lg lg:drop-shadow-none">
                            {view === 'register' ? 'Crear cuenta gratis' : 'Recuperar acceso'}
                        </h2>
                        <p className="text-slate-300 lg:text-slate-500 text-sm font-medium leading-relaxed">
                            {view === 'register'
                                ? 'Empieza a optimizar tu proceso hoy mismo.'
                                : view === 'forgot_new_pass' ? 'Establece tu nueva contraseña segura.' : 'Ingresa tus datos para buscar tu cuenta.'}
                        </p>
                    </motion.div>

                    {/* CARD DEL FORMULARIO CON GLASS SUTIL */}
                    <div className="
                        bg-white/10 lg:bg-white 
                        backdrop-blur-xl lg:backdrop-blur-none
                        p-8 rounded-[2rem] lg:rounded-3xl
                        shadow-2xl shadow-black/20 lg:shadow-slate-200/50 
                        border border-white/20 lg:border-slate-100
                        relative overflow-hidden min-h-[380px]
                    ">
                        {/* Brillo superior en borde (Mobile) */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent lg:hidden"></div>

                        <AnimatePresence mode='wait'>

                            {/* VISTA 1: REGISTRO (CON CAMPO CONFIRMAR) */}
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

                                    {/* CAMPO DE CONFIRMACIÓN NUEVO */}
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
                                        className="w-full py-4 bg-indigo-600 lg:bg-slate-900 hover:bg-indigo-500 lg:hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 lg:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group mt-4"
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
                                    <div className="p-4 bg-amber-500/20 lg:bg-amber-50 text-amber-100 lg:text-amber-800 text-sm rounded-xl border border-amber-500/30 lg:border-amber-100 flex gap-3 backdrop-blur-sm">
                                        <HelpCircle className="flex-shrink-0 text-amber-300 lg:text-amber-500" />
                                        <p>Ingresa el correo asociado a tu cuenta para buscarte en el sistema.</p>
                                    </div>
                                    <InputGroup label="Tu Email" icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="ejemplo@email.com" isMobileDark={true} />

                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 lg:bg-indigo-600 hover:bg-indigo-500 lg:hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 lg:shadow-indigo-500/20 transition-all">
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
                                    <div className="flex items-center gap-3 p-3 bg-indigo-500/20 lg:bg-indigo-50 rounded-xl border border-indigo-500/30 lg:border-indigo-100 mb-2 backdrop-blur-sm">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/30 lg:bg-indigo-100 flex items-center justify-center text-indigo-200 lg:text-indigo-600"><CheckCircle2 size={16} /></div>
                                        <div>
                                            <p className="text-xs text-indigo-200 lg:text-indigo-500 font-bold uppercase">Usuario encontrado</p>
                                            <p className="text-sm font-bold text-white lg:text-indigo-900">{email}</p>
                                        </div>
                                    </div>
                                    <PasswordInput label="Nueva Contraseña" value={password} onChange={setPassword} showValidation={true} isMobileDark={true} />

                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-500 lg:hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/30 lg:shadow-green-500/20 transition-all">
                                        {loading ? "Actualizando..." : "Cambiar Contraseña"}
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* Footer Links */}
                    {view === 'register' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center space-y-4">
                            <p className="text-sm text-slate-400 lg:text-slate-500">
                                ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} className="text-white lg:text-indigo-600 font-bold cursor-pointer hover:underline ml-1">Inicia Sesión</span>
                            </p>
                            <button type="button" onClick={() => setView('forgot_email')} className="text-xs font-medium text-indigo-300 lg:text-slate-400 hover:text-white lg:hover:text-slate-600 transition-colors flex items-center justify-center gap-1 mx-auto">
                                <Lock size={12} /> ¿Olvidaste tu contraseña?
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// --- COMPONENTES UI REUTILIZABLES (ADAPTADOS MOBILE DARK) ---

const InputGroup = ({ label, icon, type, value, onChange, placeholder, isMobileDark }) => (
    <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${isMobileDark ? 'text-slate-300 lg:text-slate-500' : 'text-slate-500'}`}>{label}</label>
        <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isMobileDark ? 'text-slate-400 group-focus-within:text-indigo-400 lg:group-focus-within:text-indigo-500' : 'text-slate-400'}`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 lg:py-3.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-600 lg:placeholder:text-slate-400
                    ${isMobileDark
                        ? 'bg-slate-900/50 lg:bg-slate-50 border-slate-700 lg:border-slate-200 text-white lg:text-slate-900 focus:ring-indigo-500/50 lg:focus:ring-indigo-500/20 focus:border-indigo-400 lg:focus:border-indigo-500 focus:bg-slate-800 lg:focus:bg-white'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

const PasswordInput = ({ value, onChange, showValidation, label = "Contraseña", isMobileDark, placeholder = "••••••••" }) => (
    <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${isMobileDark ? 'text-slate-300 lg:text-slate-500' : 'text-slate-500'}`}>{label}</label>
        <div className="relative group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isMobileDark ? 'text-slate-400 group-focus-within:text-indigo-400 lg:group-focus-within:text-indigo-500' : 'text-slate-400'}`}>
                <Lock size={20} />
            </div>
            <input
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 lg:py-3.5 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium tracking-wide placeholder:text-slate-600 lg:placeholder:text-slate-400
                    ${isMobileDark
                        ? 'bg-slate-900/50 lg:bg-slate-50 border-slate-700 lg:border-slate-200 text-white lg:text-slate-900 focus:ring-indigo-500/50 lg:focus:ring-indigo-500/20 focus:border-indigo-400 lg:focus:border-indigo-500 focus:bg-slate-800 lg:focus:bg-white'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                placeholder={placeholder}
                required
            />
        </div>
        {showValidation && (
            <div className="mt-3 grid grid-cols-2 gap-2">
                <ReqItem met={value.length >= 6} text="Mín. 6 caracteres" isMobileDark={isMobileDark} />
                <ReqItem met={/[A-Z]/.test(value)} text="Mayúscula" isMobileDark={isMobileDark} />
                <ReqItem met={/\d/.test(value)} text="Número" isMobileDark={isMobileDark} />
                <ReqItem met={/[!@#$%^&*]/.test(value)} text="Símbolo" isMobileDark={isMobileDark} />
            </div>
        )}
    </div>
);

const ReqItem = ({ met, text, isMobileDark }) => (
    <div className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors duration-300 ${met ? "text-emerald-400 lg:text-emerald-600" : (isMobileDark ? "text-slate-500 lg:text-slate-300" : "text-slate-300")}`}>
        <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${met ? "bg-emerald-500 border-emerald-500" : (isMobileDark ? "border-slate-600 lg:border-slate-200" : "border-slate-200")}`}>
            {met && <CheckCircle2 size={10} className="text-white" />}
        </div>
        <span>{text}</span>
    </div>
);

export default Register;