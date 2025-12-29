import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, UserPlus, ArrowLeft, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("¡Cuenta creada! Ahora inicia sesión.");
                navigate('/login');
            } else {
                toast.error(data.detail || "Error al registrarse");
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-slate-900 p-8 text-center relative">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute left-4 top-4 text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full hover:bg-slate-800 transition-colors"
                        title="Volver al inicio"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-900/50">
                        <BrainCircuit className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Crear Cuenta</h2>
                    <p className="text-indigo-200 text-sm">Comienza a optimizar tu reclutamiento</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleRegister} className="space-y-5">

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
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                                    placeholder="Crea una contraseña segura"
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1 ml-1">Mínimo 6 caracteres</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creando..." : <><UserPlus size={18} /> Registrarse</>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                        ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} className="text-indigo-600 font-bold cursor-pointer hover:text-indigo-800 transition-colors">Inicia Sesión</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;