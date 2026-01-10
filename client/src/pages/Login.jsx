import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
            } else {
                toast.error("Email o contraseña incorrectos");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden relative">

            {/* --- FONDO ANIMADO MÓVIL (Solo visible en lg:hidden) --- */}
            <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-slate-900"></div>
                {/* Orbes Móviles */}
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

            {/* --- LADO IZQUIERDO: FORMULARIO (Adaptado Mobile Premium) --- */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-transparent lg:bg-slate-50 relative z-10"
            >
                <div className="w-full max-w-md space-y-8 relative">

                    {/* Header Animado */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        {/* Logo Mobile (Flotante y Brillante) */}
                        <div className="inline-flex lg:hidden items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl mb-8 shadow-2xl border border-white/20 ring-1 ring-white/10">
                            <BrainCircuit className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={32} />
                        </div>

                        <h2 className="text-4xl font-black text-white lg:text-slate-900 tracking-tight mb-2 drop-shadow-lg lg:drop-shadow-none">
                            Bienvenido
                        </h2>
                        <p className="text-slate-300 lg:text-slate-500 text-lg font-medium">
                            Ingresa tus credenciales para acceder.
                        </p>
                    </motion.div>

                    {/* Card del Formulario (Glassmorphism en Mobile) */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                        className="
                            bg-white/10 lg:bg-white 
                            backdrop-blur-xl lg:backdrop-blur-none
                            p-8 rounded-[2rem] 
                            shadow-2xl shadow-black/20 lg:shadow-slate-200/50 
                            border border-white/20 lg:border-slate-100
                            relative overflow-hidden
                        "
                    >
                        {/* Brillo superior en borde (Mobile) */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent lg:hidden"></div>

                        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                            <InputGroup
                                label="Email"
                                icon={<Mail />}
                                type="email"
                                value={email}
                                onChange={setEmail}
                                placeholder="nombre@empresa.com"
                                isMobileDark={true} // Prop para ajustar colores en modo oscuro móvil
                            />

                            <div>
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="text-xs font-bold text-slate-300 lg:text-slate-500 uppercase tracking-wider">Contraseña</label>
                                    <button type="button" onClick={() => navigate('/register', { state: { initialView: 'forgot_email' } })} className="text-xs text-indigo-300 lg:text-indigo-600 font-bold hover:text-white lg:hover:text-indigo-800 transition-colors">
                                        ¿Olvidaste tu clave?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 lg:group-focus-within:text-indigo-500 transition-colors duration-300">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 lg:bg-slate-50 border border-slate-700 lg:border-slate-200 rounded-xl text-white lg:text-slate-900 focus:ring-2 focus:ring-indigo-500/50 lg:focus:ring-indigo-500/20 focus:border-indigo-400 lg:focus:border-indigo-500 focus:bg-slate-800 lg:focus:bg-white transition-all font-medium tracking-wide placeholder:text-slate-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 lg:bg-slate-900 hover:bg-indigo-500 lg:hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 lg:shadow-none flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? "Verificando..." : <>Ingresar <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                            </motion.button>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                        <p className="text-sm text-slate-400 lg:text-slate-500">
                            ¿Aún no tienes cuenta? <span onClick={() => navigate('/register')} className="text-white lg:text-indigo-600 font-bold cursor-pointer hover:underline ml-1">Crear cuenta gratis</span>
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* --- LADO DERECHO: ARTE (Escritorio - Intacto) --- */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-center p-20 overflow-hidden text-center"
            >
                {/* Botón Volver */}
                <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/')}
                    className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 z-20 font-medium"
                >
                    Volver al Inicio <ArrowRight size={18} />
                </motion.button>

                {/* Orbes Animados */}
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"></motion.div>
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></motion.div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.5 }}
                        className="inline-flex p-6 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[2rem] shadow-2xl shadow-indigo-500/30 mb-8"
                    >
                        <BrainCircuit size={64} className="text-white" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        Potencia tu Hiring
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-lg text-slate-400 max-w-sm mx-auto leading-relaxed"
                    >
                        Accede a tu panel de control y gestiona tus procesos de selección con la potencia de la IA generativa.
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

// Componente Auxiliar (Adaptado para Dark Mode Mobile)
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
                className={`w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-slate-600 lg:placeholder:text-slate-400
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

export default Login;