import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// --- IMPORTS API Y CONTEXTO ---
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';

// --- IMPORTS COMPONENTES ---
import LoginVisuals from '../components/auth/LoginVisuals';
import { InputGroup } from '../components/auth/AuthInputs';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // Función del contexto para actualizar estado global

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Llamada a la API (auth.js se encarga del fetch y validaciones)
            const data = await authAPI.login(email, password);

            // 2. Si todo sale bien, actualizamos el Contexto Global
            // El contexto se encarga de guardar en localStorage y validar usuario
            login(data.access_token);

            toast.success("¡Bienvenido de nuevo!");
            navigate('/dashboard');

        } catch (error) {
            console.error("Login Error:", error);
            // El mensaje de error ya viene procesado desde authAPI.login
            toast.error(error.message || "Error de conexión. Revisa que el Backend esté encendido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden relative">

            {/* --- LADO IZQUIERDO: FORMULARIO --- */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-transparent lg:bg-slate-50 relative z-10"
            >
                <div className="w-full max-w-md space-y-8 relative">

                    {/* Header del Formulario */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        {/* Logo Mobile */}
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

                    {/* Card del Formulario */}
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
                                isMobileDark={true}
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

            {/* COMPONENTE VISUAL DERECHO */}
            <LoginVisuals />
        </div>
    );
};

export default Login;