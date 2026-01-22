import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ChevronDown, HelpCircle, Zap, Shield, CreditCard,
    MessageSquare, FileText, ArrowLeft, BrainCircuit, Bot, Sparkles, Database
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Faq = ({ isPublic = false }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todas");

    const handleBack = () => {
        navigate('/');
    };

    const categories = [
        { id: "Todas", label: "Todas" },
        { id: "Capacidades", label: "🔥 Poderes de IA" },
        { id: "Entrevistas", label: "🤖 Gemelo Digital" },
        { id: "Datos", label: "📊 Exportación" },
        { id: "Seguridad", label: "🛡️ Privacidad" }
    ];

    const faqs = [
        {
            category: "Capacidades",
            q: "¿Puede la IA entender jergas técnicas complejas?",
            a: "Absolutamente. VeeBot no busca palabras clave simples. Nuestro motor Llama 3.3 (70B) entiende el contexto semántico. Sabe que 'React' se relaciona con 'Frontend' y que 'Kubernetes' implica 'DevOps', aunque no estén explícitos en el texto."
        },
        {
            category: "Entrevistas",
            q: "¿Es verdad que puedo 'chatear' con un PDF?",
            a: "Sí, es nuestra función estrella 'Digital Twin'. La IA absorbe la personalidad y experiencia del candidato y crea una simulación interactiva. Puedes hacerle preguntas técnicas, de soft skills o situacionales antes de llamar a la persona real."
        },
        {
            category: "Capacidades",
            q: "¿Cómo decide VeeBot quién es el mejor candidato?",
            a: "Utilizamos un sistema de Ranking Vectorial. Comparamos tu Descripción de Puesto (JD) contra miles de dimensiones en el perfil del candidato. El resultado es un 'Match Score' del 0 al 100% basado en habilidades duras, blandas y cultura."
        },
        {
            category: "Datos",
            q: "¿Puedo automatizar el contacto con los candidatos?",
            a: "Por supuesto. Con un solo clic, VeeBot extrae el email del CV, redacta un correo hiper-personalizado (invitación a entrevista o rechazo amable) y lo deja listo para enviar. Ahorras el 90% de tu tiempo administrativo."
        },
        {
            category: "Entrevistas",
            q: "¿Puedo comparar dos candidatos cara a cara?",
            a: "Sí. Nuestra función 'Versus AI' pone a dos perfiles en el ring. La IA analiza sus fortalezas y debilidades comparativas y te entrega un veredicto sobre quién es técnicamente superior para tu puesto específico."
        },
        {
            category: "Datos",
            q: "¿Puedo llevarme mis datos a Excel?",
            a: "Tus datos son tuyos. Exporta reportes completos en CSV o Excel que incluyen: datos de contacto, puntuación de IA, resumen ejecutivo generado y estado del proceso. Ideal para presentar a clientes o directivos."
        },
        {
            category: "Seguridad",
            q: "¿Mis candidatos se comparten con otras empresas?",
            a: "Nunca. Tu base de datos es un silo aislado y encriptado (AES-256). No utilizamos tus datos para entrenar modelos públicos ni los compartimos con terceros. Cumplimos con GDPR estrictamente."
        },
        {
            category: "Capacidades",
            q: "¿Qué pasa si un CV está en otro idioma?",
            a: "No hay barreras. VeeBot es políglota nativo. Procesa, analiza y resume CVs en Español, Inglés, Portugués, Francés, Alemán e Italiano instantáneamente, unificando todo en tu idioma preferido."
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || faq.a.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "Todas" || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // --- VARIABLES DE JSX ---
    const contentMarkup = (
        <div className={`max-w-5xl mx-auto px-6 ${isPublic ? '' : 'w-full'}`}>

            {/* HEADER */}
            <div className="text-center mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-200/50 dark:border-white/10 backdrop-blur-md"
                >
                    <Sparkles size={14} className="animate-pulse" /> Knowledge Base
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-black mb-8 tracking-tighter leading-tight ${isPublic ? 'text-5xl md:text-7xl text-slate-900' : 'text-4xl md:text-6xl text-slate-900 dark:text-white'}`}
                >
                    {isPublic ? (
                        <>Descubre el <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">Poder Real</span><br />de VeeBot AI</>
                    ) : (
                        <>Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">Inteligencia</span></>
                    )}
                </motion.h1>

                {/* SEARCH BAR */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative max-w-xl mx-auto group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center">
                        <Search className="absolute left-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
                        <input
                            type="text"
                            placeholder="Pregunta sobre capacidades, IA, exportación..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full py-5 pl-14 pr-6 bg-transparent outline-none text-lg font-medium transition-all rounded-2xl placeholder:text-slate-400 ${isPublic ? 'text-slate-900' : 'text-slate-900 dark:text-white'}`}
                        />
                    </div>
                </motion.div>
            </div>

            {/* CATEGORY TABS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-3 mb-16 relative z-10"
            >
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all relative overflow-hidden group ${activeCategory === cat.id
                                ? 'text-white shadow-lg shadow-indigo-500/30 scale-105'
                                : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        {activeCategory === cat.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600"
                            />
                        )}
                        <span className="relative z-10">{cat.label}</span>
                    </button>
                ))}
            </motion.div>

            {/* FAQ LIST (OPTIMIZADA) */}
            <motion.div layout className="space-y-5 pb-24 relative z-10 max-w-3xl mx-auto">
                <AnimatePresence initial={false}>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <FaqItem
                                key={faq.q} // <--- CLAVE ESTABLE (FIX DEL LAG)
                                faq={faq}
                                isPublic={isPublic}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={30} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No encontramos respuestas para "{searchTerm}"</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );

    if (isPublic) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
                <Navbar />

                <motion.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                    onClick={handleBack}
                    className="fixed top-28 left-6 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl hover:scale-110 active:scale-95 transition-all group"
                >
                    <ArrowLeft size={22} className="text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors" />
                </motion.button>

                <div className="pt-32 relative">
                    {/* FONDO AMBIENTAL */}
                    <div className="absolute top-0 left-0 w-full h-[1200px] overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
                        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
                        <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
                    </div>

                    {contentMarkup}
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300 relative overflow-hidden">
            {/* FONDO DASHBOARD */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            {contentMarkup}
        </div>
    );
};

// --- COMPONENTE ITEM ---
const FaqItem = ({ faq, isPublic }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`group rounded-3xl transition-all duration-300 overflow-hidden relative border
            ${isOpen
                    ? 'bg-white dark:bg-slate-900 border-indigo-500/30 shadow-2xl shadow-indigo-500/10 z-10'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:bg-white dark:hover:bg-slate-900'}`}
        >
            {/* Glow lateral */}
            {isOpen && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none relative z-10"
            >
                <div className="flex items-center gap-5 md:gap-6">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${isOpen
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg rotate-3 scale-110'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-105'
                        }`}>
                        {getIcon(faq.category)}
                    </div>
                    <span className={`text-lg md:text-xl font-bold leading-tight pr-4 transition-colors ${isOpen
                            ? 'text-indigo-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}>
                        {faq.q}
                    </span>
                </div>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${isOpen
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 rotate-180'
                        : 'bg-transparent border-slate-200 dark:border-slate-700 group-hover:border-indigo-300'
                    }`}>
                    <ChevronDown size={20} className={`transition-colors ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} strokeWidth={2.5} />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 md:px-8 pb-8 pl-[5.5rem] md:pl-[6.5rem]">
                            <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                                {faq.a}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const getIcon = (category) => {
    switch (category) {
        case 'Capacidades': return <BrainCircuit size={24} />;
        case 'Entrevistas': return <Bot size={24} />;
        case 'Datos': return <Database size={24} />;
        case 'Seguridad': return <Shield size={24} />;
        default: return <FileText size={24} />;
    }
};

export default Faq;