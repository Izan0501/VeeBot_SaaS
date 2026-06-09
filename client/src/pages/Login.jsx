/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { m } from 'framer-motion';

// --- IMPORTS API Y CONTEXTO ---
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';

// --- DOMAIN UTILS (cross-origin redirect) ---
import { getTenantOrigin } from '../utils/domain';

// --- IMPORTS COMPONENTES ---
import LoginVisuals from '../components/auth/LoginVisuals';
import { InputGroup } from '../components/auth/AuthInputs';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Authenticate — backend returns { access_token, token_type, subdomain }
            const data = await authAPI.login(email, password);

            toast.success('¡Bienvenido de nuevo!', { duration: 1000 });

            if (data.subdomain) {
                // 2a. TENANT USER — Token Handoff pattern.
                //
                //     WHY NOT cookies?
                //     Browsers treat "localhost" and "*.localhost" as separate sites.
                //     Chrome/Firefox block or ignore "Domain=localhost" cookies,
                //     so saveSessionCookie() doesn't reliably work in dev.
                //
                //     WHY NOT window.location.replace(subdomain + '/dashboard')?
                //     The browser navigates to the new origin with empty localStorage.
                //     The cookie we set doesn't arrive. AuthContext finds no token.
                //     Result: redirect to /login on the subdomain (double login).
                //
                //     THE FIX — Token Handoff:
                //     We encode the JWT in the URL and send the browser to a
                //     dedicated /auth/handoff route ON the tenant subdomain.
                //     That component runs under the subdomain's origin, writes
                //     the token to ITS localStorage, then redirects to /dashboard.
                //     The token is in the URL for <100ms and is immediately
                //     purged from browser history by the handoff component.
                const handoffUrl = new URL(
                    `${getTenantOrigin(data.subdomain)}/auth/handoff`
                );
                handoffUrl.searchParams.set('token', data.access_token);

                // Hard replace — this page leaves history so back button
                // goes to the landing page, not back to login.
                window.location.replace(handoffUrl.toString());
            } else {
                // 2b. NO TENANT — platform super-admin stays at root.
                //     Safe to use login() + navigate() since we stay same-origin.
                login(data.access_token);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error(error.message || 'Error de conexión. Revisa que el Backend esté encendido.');
            setLoading(false);
        }

    };

    return (
        // Contenedor principal: Se adapta al modo oscuro en escritorio
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden relative transition-colors duration-300">

            {/* --- LADO IZQUIERDO: FORMULARIO --- */}
            <m.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-transparent lg:bg-slate-50 dark:lg:bg-slate-950 relative z-10 transition-colors duration-300"
            >
                <div className="w-full max-w-md space-y-8 relative">

                    {/* Header del Formulario */}
                    <m.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        {/* Logo Mobile */}
                        <div className="inline-flex lg:hidden items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl mb-8 shadow-2xl border border-white/20 ring-1 ring-white/10">
                            <BrainCircuit className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={32} />
                        </div>

                        <h2 className="text-4xl font-black text-white lg:text-slate-900 dark:lg:text-white tracking-tight mb-2 drop-shadow-lg lg:drop-shadow-none transition-colors">
                            Bienvenido
                        </h2>
                        <p className="text-slate-300 lg:text-slate-500 dark:lg:text-slate-400 text-lg font-medium transition-colors">
                            Ingresa tus credenciales para acceder.
                        </p>
                    </m.div>

                    {/* Card del Formulario */}
                    <m.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                        className="
                            bg-white/10 lg:bg-white dark:lg:bg-slate-900
                            backdrop-blur-xl lg:backdrop-blur-none
                            p-8 rounded-[2rem] 
                            shadow-2xl shadow-black/20 lg:shadow-slate-200/50 dark:lg:shadow-none
                            border border-white/20 lg:border-slate-100 dark:lg:border-slate-800
                            relative overflow-hidden transition-all duration-300
                        "
                    >
                        {/* Brillo superior en borde (Mobile) */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent lg:hidden"></div>

                        <form onSubmit={handleLogin} className="space-y-6 relative z-10">

                            {/* Input Email (Usando el componente existente) */}
                            <InputGroup
                                label="Email"
                                icon={<Mail />}
                                type="email"
                                value={email}
                                onChange={setEmail}
                                placeholder="nombre@empresa.com"
                                isMobileDark={true} // Mantiene estilo oscuro en mobile, el componente debe manejar el dark mode desktop internamente
                            />

                            {/* Input Password Manual */}
                            <div>
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    {/* eslint-disable-next-line react-doctor/label-has-associated-control */}
<label className="text-xs font-bold text-slate-300 lg:text-slate-500 dark:lg:text-slate-400 uppercase tracking-wider transition-colors">
                                        Contraseña
                                    </label>
                                    <button aria-label="Interactive control"
                                        type="button"
                                        onClick={() => navigate('/contact')}
                                        className="text-xs text-indigo-300 lg:text-indigo-600 dark:lg:text-indigo-400 font-bold hover:text-white lg:hover:text-indigo-800 dark:lg:hover:text-indigo-300 transition-colors"
                                    >
                                        ¿Olvidaste tu clave?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 lg:group-focus-within:text-indigo-500 dark:lg:group-focus-within:text-indigo-400 transition-colors duration-300">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="
                                            w-full pl-12 pr-4 py-4 
                                            bg-slate-900/50 lg:bg-slate-50 dark:lg:bg-slate-950
                                            border border-slate-700 lg:border-slate-200 dark:lg:border-slate-800
                                            rounded-xl 
                                            text-white lg:text-slate-900 dark:lg:text-white
                                            focus:ring-2 focus:ring-indigo-500/50 lg:focus:ring-indigo-500/20 
                                            focus:border-indigo-400 lg:focus:border-indigo-500 dark:lg:focus:border-indigo-500
                                            focus:bg-slate-800 lg:focus:bg-white dark:lg:focus:bg-slate-900
                                            transition-colors duration-300 ease-in-out font-medium tracking-wide 
                                            placeholder:text-slate-600 dark:placeholder:text-slate-600
                                        "
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <m.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 group transition-all mt-2
                                    disabled:opacity-70 disabled:cursor-not-allowed
                                    
                                    /* Colores reactivos */
                                    bg-neutral-900 text-white hover:bg-neutral-800 
                                    dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200
                                    transition-colors duration-300 ease-in-out
                                "
                            >
                                {loading ? "Verificando…" : <>Ingresar <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                            </m.button>
                        </form>
                    </m.div>

                    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                        <p className="text-sm text-slate-400 lg:text-slate-500 dark:lg:text-slate-400">
                            ¿Aún no tienes cuenta?
                            <Link to="/onboarding"
                                className="text-white lg:text-indigo-600 dark:lg:text-indigo-400 font-bold cursor-pointer hover:underline ml-1"
                            >
                                Crear cuenta gratis
                            </Link>
                        </p>
                    </m.div>
                </div>
            </m.div>

            {/* COMPONENTE VISUAL DERECHO (No cambia en dark mode, mantiene su estilo propio) */}
            <LoginVisuals />
        </div>
    );
};

export default Login;