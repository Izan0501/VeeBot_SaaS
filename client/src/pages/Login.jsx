import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                onLogin();
                toast.success("¡Bienvenido de nuevo!");
                navigate('/dashboard');
            } else { toast.error("Email o contraseña incorrectos"); }
        } catch { toast.error("Error de conexión"); }
        finally { setLoading(false); }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">

            {/* BOTÓN VOLVER (Solo visible móvil, en desktop hay flecha) */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all lg:hidden"
            >
                <ArrowLeft size={20} />
            </button>

            {/* --- LADO IZQUIERDO: FORMULARIO (Claro) --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        {/* Logo solo en Mobile */}
                        <div className="inline-flex lg:hidden items-center justify-center p-3 bg-indigo-600 rounded-xl mb-6 shadow-lg shadow-indigo-200">
                            <BrainCircuit className="text-white" size={28} />
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Bienvenido de nuevo</h2>
                        <p className="text-slate-500 text-lg">Ingresa tus credenciales para acceder al dashboard.</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <form onSubmit={handleLogin} className="space-y-6">

                            <InputGroup label="Email" icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="nombre@empresa.com" />

                            <div>
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
                                    <button type="button" onClick={() => navigate('/register', { state: { initialView: 'forgot_email' } })} className="text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                                        ¿Olvidaste tu clave?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium tracking-wide"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                {loading ? "Verificando..." : <>Ingresar <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            ¿Aún no tienes cuenta? <span onClick={() => navigate('/register')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Crear cuenta gratis</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* --- LADO DERECHO: ARTE (Oscuro/Branding) --- */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-center p-20 overflow-hidden text-center">
                {/* Botón Volver Desktop */}
                <button onClick={() => navigate('/')} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 z-20">
                    Volver al Inicio <ArrowRight size={18} />
                </button>

                {/* Efectos de Fondo */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-50"></div>

                <div className="relative z-10">
                    <div className="inline-flex p-6 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/30 mb-8">
                        <BrainCircuit size={64} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">Potencia tu Hiring</h2>
                    <p className="text-lg text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Accede a tu panel de control y gestiona tus procesos de selección con la potencia de la IA generativa.
                    </p>

                    <div className="mt-12 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake Logos for Trust */}
                        <div className="text-xl font-serif font-bold text-white">Acme Inc.</div>
                        <div className="text-xl font-sans font-black text-white">GLOBEX</div>
                        <div className="text-xl font-mono font-bold text-white">Stark</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente Auxiliar (Mismo que Register)
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

export default Login;