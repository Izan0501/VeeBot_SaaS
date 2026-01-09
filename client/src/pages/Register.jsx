import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    BrainCircuit, UserPlus, ArrowLeft, Mail, Lock, KeyRound,
    CheckCircle2, HelpCircle, ArrowRight, Star, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Control de Vistas
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

    // --- HANDLERS (Igual lógica, solo cambia UI) ---
    const handleRegister = async (e) => {
        e.preventDefault();
        const errorMsg = validatePassword(password);
        if (errorMsg) return toast.error(errorMsg);
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

    return (
        <div className="flex min-h-screen bg-white font-sans">

            {/* BOTÓN VOLVER (Flotante) */}
            <button
                onClick={() => {
                    if (view !== 'register') setView('register'); // Si está en recuperar, vuelve a registro
                    else navigate('/'); // Si está en registro, vuelve al home
                }}
                className="absolute top-6 left-6 z-50 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
            >
                <ArrowLeft size={20} />
            </button>

            {/* --- LADO IZQUIERDO: ARTE Y MENSAJE (Oscuro) --- */}
            <div className="hidden lg:flex w-1/2 bg-slate-950 relative flex-col justify-between p-16 overflow-hidden">
                {/* Fondos abstractos */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

                {/* Contenido Visual */}
                <div className="relative z-10 mt-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <Star size={12} className="fill-indigo-300" /> Únete a los líderes
                    </div>
                    <h1 className="text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                        El futuro del <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Reclutamiento.</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Deja de leer CVs manualmente. Únete a miles de reclutadores que usan VeeBot para encontrar el talento oculto en segundos.
                    </p>
                </div>

                {/* Features List */}
                <div className="relative z-10 space-y-4">
                    {[
                        "Análisis semántico con IA (Llama 3.3)",
                        "Filtrado automático de candidatos",
                        "Seguridad de datos nivel Enterprise"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-300">
                            <div className="p-1 rounded-full bg-green-500/20 text-green-400"><CheckCircle2 size={16} /></div>
                            <span className="text-sm font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="relative z-10 text-xs text-slate-600">
                    © 2026 VeeBot Inc. Todos los derechos reservados.
                </div>
            </div>

            {/* --- LADO DERECHO: FORMULARIO (Claro) --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative">

                {/* Decoración móvil (solo visible en pantallas chicas) */}
                <div className="lg:hidden absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

                <div className="w-full max-w-md space-y-8">

                    {/* Header del Formulario */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex lg:hidden items-center justify-center p-3 bg-indigo-600 rounded-xl mb-6 shadow-lg shadow-indigo-200">
                            <BrainCircuit className="text-white" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {view === 'register' ? 'Crear cuenta gratis' : 'Recuperar acceso'}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {view === 'register'
                                ? 'Empieza a optimizar tu proceso de selección hoy mismo.'
                                : 'Ingresa tus datos para restablecer tu contraseña.'}
                        </p>
                    </div>

                    {/* --- CONTENIDO DINÁMICO --- */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">

                        {/* VISTA 1: REGISTRO */}
                        {view === 'register' && (
                            <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <InputGroup label="Email Corporativo" icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="nombre@empresa.com" />
                                <PasswordInput value={password} onChange={setPassword} showValidation={true} />

                                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    {loading ? "Creando..." : <><UserPlus size={20} /> Crear Cuenta</>}
                                </button>
                            </form>
                        )}

                        {/* VISTA 2: EMAIL RECUPERACIÓN */}
                        {view === 'forgot_email' && (
                            <form onSubmit={verifyEmail} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-xl border border-amber-100 flex gap-3">
                                    <HelpCircle className="flex-shrink-0 text-amber-500" />
                                    <p>Ingresa el correo asociado a tu cuenta para buscarte en el sistema.</p>
                                </div>
                                <InputGroup label="Tu Email" icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="ejemplo@email.com" />
                                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
                                    {loading ? "Buscando..." : "Continuar"}
                                </button>
                            </form>
                        )}

                        {/* VISTA 3: NUEVA CONTRASEÑA */}
                        {view === 'forgot_new_pass' && (
                            <form onSubmit={handleDirectReset} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><CheckCircle2 size={16} /></div>
                                    <div>
                                        <p className="text-xs text-indigo-500 font-bold uppercase">Usuario encontrado</p>
                                        <p className="text-sm font-bold text-indigo-900">{email}</p>
                                    </div>
                                </div>
                                <PasswordInput label="Nueva Contraseña" value={password} onChange={setPassword} showValidation={true} />
                                <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all">
                                    {loading ? "Actualizando..." : "Cambiar Contraseña"}
                                </button>
                            </form>
                        )}

                    </div>

                    {/* Footer Links */}
                    {view === 'register' && (
                        <div className="text-center space-y-4">
                            <p className="text-sm text-slate-500">
                                ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Inicia Sesión</span>
                            </p>
                            <button type="button" onClick={() => setView('forgot_email')} className="text-xs font-medium text-slate-400 hover:text-slate-600">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// --- COMPONENTES UI REUTILIZABLES ---

const InputGroup = ({ label, icon, type, value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

const PasswordInput = ({ value, onChange, showValidation, label = "Contraseña" }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Lock size={20} />
            </div>
            <input
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium tracking-wide"
                placeholder="••••••••"
                required
            />
        </div>
        {showValidation && (
            <div className="mt-3 grid grid-cols-2 gap-2">
                <ReqItem met={value.length >= 6} text="Mín. 6 caracteres" />
                <ReqItem met={/[A-Z]/.test(value)} text="Mayúscula" />
                <ReqItem met={/\d/.test(value)} text="Número" />
                <ReqItem met={/[!@#$%^&*]/.test(value)} text="Símbolo" />
            </div>
        )}
    </div>
);

const ReqItem = ({ met, text }) => (
    <div className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors duration-300 ${met ? "text-emerald-600" : "text-slate-300"}`}>
        <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${met ? "bg-emerald-500 border-emerald-500" : "border-slate-200"}`}>
            {met && <CheckCircle2 size={10} className="text-white" />}
        </div>
        <span>{text}</span>
    </div>
);

export default Register;