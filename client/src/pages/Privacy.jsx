import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Shield, Eye, Database } from 'lucide-react';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

            {/* Navbar Simple */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-emerald-600 p-1.5 rounded-lg text-white"><Lock size={18} /></div>
                    <span className="font-bold text-lg">VeeBot Privacy</span>
                </div>
                <button onClick={() => navigate('/')} className="text-sm font-medium text-slate-500 hover:text-emerald-600 flex items-center gap-1">
                    <ArrowLeft size={16} /> Volver al Inicio
                </button>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-20">

                {/* Header Documento */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase mb-6">
                        <Shield size={14} /> Datos protegidos
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Política de Privacidad</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Tu privacidad es nuestra prioridad. Te explicamos claramente qué hacemos (y qué no hacemos) con tu información.
                    </p>
                </div>

                {/* Grid de Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 mb-4"><Database size={20} /></div>
                        <h3 className="font-bold text-lg mb-2">No entrenamos con tus datos</h3>
                        <p className="text-sm text-slate-500">Los CVs que subes NO se utilizan para entrenar nuestros modelos de IA. Son privados para tu cuenta.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 mb-4"><Eye size={20} /></div>
                        <h3 className="font-bold text-lg mb-2">Acceso Restringido</h3>
                        <p className="text-sm text-slate-500">Solo tú tienes acceso a los candidatos que subes. Ni siquiera nuestro equipo técnico accede sin tu permiso explícito.</p>
                    </div>
                </div>

                {/* Contenido Detallado */}
                <div className="space-y-12">

                    <section>
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">1. Información que Recopilamos</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Recopilamos la información necesaria para el funcionamiento del servicio:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                            <li>Datos de cuenta: Nombre, email y contraseña (encriptada).</li>
                            <li>Datos de facturación: Procesados externamente por Lemon Squeezy (no almacenamos tarjetas).</li>
                            <li>Datos de uso: Documentos PDF subidos y sus análisis vectoriales generados por la IA.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">2. Almacenamiento y Seguridad</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Utilizamos <strong>MongoDB Atlas</strong> con encriptación en reposo para tu base de datos y <strong>Pinecone</strong> para los vectores de búsqueda semántica. Toda la comunicación viaja a través de SSL/TLS (HTTPS). Implementamos controles de acceso estrictos en nuestra infraestructura.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">3. Tus Derechos (GDPR/CCPA)</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Tienes control total sobre tus datos. Puedes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                            <li>Solicitar una copia de todos tus datos.</li>
                            <li>Eliminar permanentemente candidatos individuales o tu cuenta completa.</li>
                            <li>Rectificar información incorrecta en tu perfil.</li>
                        </ul>
                    </section>

                    <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-500 text-center">
                            Si tienes preguntas sobre seguridad, escribe a <a href="mailto:security@veebot.ai" className="text-emerald-600 hover:underline font-medium">security@veebot.ai</a>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Privacy;