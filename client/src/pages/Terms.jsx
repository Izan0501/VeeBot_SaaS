import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

            {/* Navbar Simple */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><FileText size={18} /></div>
                    <span className="font-bold text-lg">VeeBot Legal</span>
                </div>
                <button onClick={() => navigate('/')} className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                    <ArrowLeft size={16} /> Volver al Inicio
                </button>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-20">

                {/* Header Documento */}
                <div className="mb-16 text-center">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest text-xs uppercase mb-2 block">Última actualización: Enero 2026</span>
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Términos de Servicio</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Por favor lee estos términos cuidadosamente antes de usar nuestra plataforma de reclutamiento IA.
                    </p>
                </div>

                {/* Contenido Legal */}
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">

                    <section>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-indigo-600">1.</span> Aceptación de los Términos</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Al acceder y utilizar VeeBot ("el Servicio"), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio. Nos reservamos el derecho de modificar estos términos en cualquier momento.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-indigo-600">2.</span> Uso de la Inteligencia Artificial</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            VeeBot utiliza modelos de lenguaje avanzados (LLMs) como Llama 3.3 para analizar documentos. Aunque nos esforzamos por la precisión:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 marker:text-indigo-500">
                            <li>La IA puede cometer errores o alucinaciones en el análisis.</li>
                            <li>La decisión final de contratación es responsabilidad exclusiva del usuario humano.</li>
                            <li>VeeBot no garantiza la contratación de ningún candidato.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-indigo-600">3.</span> Suscripciones y Pagos</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            El servicio se ofrece bajo un modelo de suscripción mensual o anual. Los pagos son procesados de forma segura a través de <strong>Lemon Squeezy</strong>. Puedes cancelar tu suscripción en cualquier momento desde el panel de configuración, manteniendo el acceso hasta el final del ciclo de facturación actual.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-indigo-600">4.</span> Propiedad de Datos</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Tú conservas todos los derechos sobre los CVs y datos que subes a la plataforma. VeeBot no vende ni comparte tus datos con terceros. Los datos se utilizan únicamente para proporcionarte el servicio de análisis y se almacenan de forma encriptada.
                        </p>
                    </section>

                    <section className="p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold text-lg mb-2">Contacto Legal</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Para consultas legales o reportar violaciones, contáctanos en <a href="mailto:legal@veebot.ai" className="text-indigo-600 hover:underline">legal@veebot.ai</a>.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Terms;