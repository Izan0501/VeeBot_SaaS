import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, ArrowLeft, Send, MessageSquare, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulación de envío
        setTimeout(() => {
            setLoading(false);
            toast.success("Mensaje enviado correctamente. Te contactaremos pronto.");
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 selection:bg-indigo-500 selection:text-white">

            {/* Botón Volver Flotante */}
            <button
                onClick={() => navigate('/')}
                className="fixed top-6 left-6 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:scale-105 transition-all group"
            >
                <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-indigo-600" />
            </button>

            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* COLUMNA IZQUIERDA (Info & Arte) */}
                <div className="lg:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-center p-12 lg:p-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950 z-0"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>

                    <div className="relative z-10 space-y-8">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                            Hablemos <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">de futuro.</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                            ¿Tienes dudas sobre el plan Agency? ¿Quieres una integración a medida? Estamos aquí para ayudarte a escalar tu reclutamiento.
                        </p>

                        <div className="space-y-6 pt-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-indigo-400">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Email Directo</p>
                                    <a href="mailto:soporte@veebot.ai" className="text-white hover:text-indigo-400 transition-colors text-lg">soporte@veebot.ai</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-pink-400">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Oficinas</p>
                                    <p className="text-white text-lg">Buenos Aires, Argentina</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA (Formulario) */}
                <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-slate-50 dark:bg-slate-950">
                    <div className="w-full max-w-lg space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Envíanos un mensaje</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Solemos responder en menos de 2 horas.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre</label>
                                    <input required type="text" placeholder="Tu nombre" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Apellido</label>
                                    <input type="text" placeholder="Tu apellido" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Corporativo</label>
                                <input required type="email" placeholder="nombre@empresa.com" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mensaje</label>
                                <textarea required rows="4" placeholder="¿En qué podemos ayudarte?" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none dark:text-white"></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Send size={20} />}
                                {loading ? "Enviando..." : "Enviar Mensaje"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;