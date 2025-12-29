import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit, UserPlus, ArrowLeft, Mail, Lock, KeyRound, CheckCircle2, HelpCircle} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    // Estados generales
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Control de Vistas: 'register' | 'forgot_email' | 'forgot_new_pass'
    const [view, setView] = useState(location.state?.initialView || 'register');

    useEffect(() => {
        if (location.state?.initialView) {
            window.history.replaceState({}, document.title);
        }
    }, []);

    // --- VALIDACIÓN DE PASSWORD ---
    const validatePassword = (pass) => {
        if (pass.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
        if (!/[A-Z]/.test(pass)) return "Falta al menos una letra mayúscula.";
        if (!/\d/.test(pass)) return "Falta al menos un número.";
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) return "Falta un carácter especial (ej: ! _ - @).";
        return null;
    };

    // --- 1. REGISTRO NORMAL ---
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
                toast.success("¡Cuenta creada! Inicia sesión.");
                navigate('/login');
            } else {
                toast.error(data.detail || "Error al registrarse");
            }
        } catch { toast.error("Error de conexión"); }
        finally { setLoading(false); }
    };

    // --- 2. VERIFICAR EMAIL (Paso 1 de Recuperación) ---
    const verifyEmail = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Ingresa tu correo");

        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                toast.success("Correo verificado. Ingresa tu nueva clave.");
                setView('forgot_new_pass'); // Pasamos a la siguiente pantalla
            } else {
                toast.error("El correo no existe en nuestra base de datos.");
            }
        } catch { toast.error("Error de conexión"); }
        finally { setLoading(false); }
    };

    // --- 3. CAMBIAR CONTRASEÑA DIRECTO (Paso 2 de Recuperación) ---
    const handleDirectReset = async (e) => {
        e.preventDefault();
        const errorMsg = validatePassword(password);
        if (errorMsg) return toast.error(errorMsg);

        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/auth/reset-password-direct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    new_password: password
                })
            });

            if (res.ok) {
                toast.success("¡Contraseña cambiada! Iniciando sesión...");
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast.error("Error al cambiar la contraseña.");
            }
        } catch { toast.error("Error de conexión"); }
        finally { setLoading(false); }
    };

    // Estilo común para botones
    const btnClass = "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";

    // --- RENDERIZADO ---
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* HEADER */}
                <div className="bg-slate-900 p-8 text-center relative">
                    <button
                        onClick={() => {
                            if (view === 'forgot_new_pass') setView('forgot_email');
                            else if (view === 'forgot_email') setView('register');
                            else navigate('/');
                        }}
                        className="absolute left-4 top-4 text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-900/50">
                        {view === 'register' ? <BrainCircuit className="text-white" size={32} /> : <KeyRound className="text-white" size={32} />}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {view === 'register' ? 'Crear Cuenta' : 'Recuperar Cuenta'}
                    </h2>
                    <p className="text-indigo-200 text-sm">
                        {view === 'forgot_new_pass' ? 'Establece tu nueva contraseña' : 'Gestiona tu acceso de forma segura'}
                    </p>
                </div>

                <div className="p-8">

                    {/* --- 1. VISTA REGISTRO --- */}
                    {view === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <InputGroup label="Correo Electrónico" icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="tu@email.com" />
                            <PasswordInput value={password} onChange={setPassword} showValidation={true} />

                            <button type="submit" disabled={loading} className={btnClass}>
                                {loading ? "Procesando..." : <><UserPlus size={18} /> Crear Cuenta</>}
                            </button>
                        </form>
                    )}

                    {/* --- 2. VISTA RECUPERAR (Paso 1: Email) --- */}
                    {view === 'forgot_email' && (
                        <form onSubmit={verifyEmail} className="space-y-5 animate-in slide-in-from-right duration-300">
                            <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-200 mb-4">
                                <strong>Modo Demo:</strong> Ingresa tu email para restablecer la clave inmediatamente sin confirmación.
                            </div>
                            <InputGroup label="Ingresa tu email" icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="tu@email.com" />

                            <button type="submit" disabled={loading} className={btnClass}>
                                {loading ? "Verificando..." : "Continuar"}
                            </button>
                        </form>
                    )}

                    {/* --- 3. VISTA RECUPERAR (Paso 2: Nueva Clave) --- */}
                    {view === 'forgot_new_pass' && (
                        <form onSubmit={handleDirectReset} className="space-y-5 animate-in slide-in-from-right duration-300">
                            <div className="text-center mb-4">
                                <span className="text-sm text-slate-500">Restableciendo clave para:</span>
                                <p className="font-bold text-slate-800">{email}</p>
                            </div>

                            <PasswordInput value={password} onChange={setPassword} showValidation={true} label="Nueva Contraseña" />

                            <button type="submit" disabled={loading} className={btnClass}>
                                {loading ? "Guardando..." : "Cambiar Contraseña"}
                            </button>
                        </form>
                    )}

                    {/* FOOTER LINKS */}
                    {view === 'register' && (
                        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500 space-y-3">
                            <p>¿Ya tienes cuenta? <span onClick={() => navigate('/login')} className="text-indigo-600 font-bold cursor-pointer hover:text-indigo-800 transition-colors">Inicia Sesión</span></p>
                            <button
                                type="button"
                                onClick={() => setView('forgot_email')}
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all group pt-3"
                            >
                                <div className="p-1 rounded-full bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                                    <HelpCircle size={14} />
                                </div>
                                <span>Recuperar mi contraseña</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTES AUXILIARES ---

const InputGroup = ({ label, icon, type, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{React.cloneElement(icon, { size: 20 })}</div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

const PasswordInput = ({ value, onChange, showValidation, label = "Contraseña" }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={20} /></div>
            <input
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                placeholder="••••••••"
                required
            />
        </div>
        {showValidation && (
            <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                <RequirementItem met={value.length >= 6} text="Mínimo 6 caracteres" />
                <RequirementItem met={/[A-Z]/.test(value)} text="Una letra mayúscula" />
                <RequirementItem met={/\d/.test(value)} text="Un número" />
                <RequirementItem met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)} text="Carácter especial (!@#...)" />
            </div>
        )}
    </div>
);

const RequirementItem = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${met ? "text-green-600 font-bold" : "text-slate-400"}`}>
        {met ? <CheckCircle2 size={14} className="flex-shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />}
        <span>{text}</span>
    </div>
);

export default Register;