import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, ArrowRight, HelpCircle } from 'lucide-react';
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
                toast.success("¡Bienvenido!");
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

    // Función para ir a recuperar contraseña
    const goToForgot = () => {
        // Navegamos al registro pasando un estado para que sepa qué vista mostrar
        navigate('/register', { state: { initialView: 'forgot_email' } });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-slate-900 p-8 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-900/50">
                        <BrainCircuit className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
                    <p className="text-indigo-200 text-sm">Accede a tu panel de reclutamiento inteligente</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Input Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                    placeholder="ejemplo@empresa.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Contraseña</label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? "Verificando..." : <>Ingresar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                        ¿No tienes cuenta? <span onClick={() => navigate('/register')} className="text-indigo-600 font-bold cursor-pointer hover:text-indigo-800 transition-colors">Regístrate gratis</span>
                        <button
                            type="button"
                            onClick={goToForgot}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all group mt-6"
                        >
                            <div className="p-1 rounded-full bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                                <HelpCircle size={14} />
                            </div>
                            <span>Recuperar mi contraseña</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;