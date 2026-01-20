import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ChevronDown, HelpCircle, Zap, Shield, CreditCard,
    MessageSquare, FileText, ArrowLeft
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
        { id: "General", label: "General" },
        { id: "Tecnico", label: "Técnico & IA" },
        { id: "Billing", label: "Facturación" },
        { id: "Privacy", label: "Privacidad" }
    ];

    const faqs = [
        {
            category: "General",
            q: "¿Qué es exactamente VeeBot AI?",
            a: "VeeBot es un ATS (Sistema de Seguimiento de Candidatos) de próxima generación. Utilizamos Inteligencia Artificial (Llama 3.3) para leer, interpretar y clasificar currículums automáticamente, eliminando el trabajo manual de lectura y filtrado."
        },
        {
            category: "Tecnico",
            q: "¿Qué tecnología de IA utilizan?",
            a: "Utilizamos una arquitectura RAG (Retrieval-Augmented Generation) potenciada por Llama 3.3 de Meta corriendo sobre hardware Groq para velocidad infernal. Los vectores se almacenan en Pinecone DB para búsquedas semánticas precisas."
        },
        {
            category: "Billing",
            q: "¿Hay contratos de permanencia?",
            a: "No. Creemos en la libertad. Puedes cancelar tu suscripción 'Agency' en cualquier momento desde tu panel de configuración con un solo clic. El acceso se mantendrá hasta el final del ciclo de facturación actual."
        },
        {
            category: "Privacy",
            q: "¿Mis datos son compartidos con otros?",
            a: "Absolutamente no. Tu base de datos de candidatos está aislada lógicamente. No utilizamos tus datos para entrenar modelos públicos ni los compartimos con terceros."
        },
        {
            category: "Tecnico",
            q: "¿Soporta CVs en otros idiomas?",
            a: "Sí. Nuestro motor OCR y de NLP es multilingüe. Puede procesar y analizar CVs en Español, Inglés, Portugués, Francés y Alemán sin configuración adicional."
        },
        {
            category: "Billing",
            q: "¿Ofrecen reembolso?",
            a: "Sí. Ofrecemos una garantía de satisfacción de 7 días. Si VeeBot no te ahorra tiempo en tu primera semana, te devolvemos el 100% de tu dinero."
        },
        {
            category: "General",
            q: "¿Puedo exportar mis datos?",
            a: "Tus datos son tuyos. Puedes exportar la lista completa de candidatos, incluyendo sus puntajes y análisis de IA, a formato CSV o Excel en cualquier momento."
        },
        {
            category: "Privacy",
            q: "¿Cumplen con GDPR?",
            a: "Sí. Estamos diseñados bajo los principios de privacidad por diseño. Tienes derecho al olvido: si eliminas un candidato, se borra permanentemente de nuestros servidores y vectores."
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || faq.a.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "Todas" || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // --- CORRECCIÓN: Variable en lugar de función de componente ---
    const contentMarkup = (
        <div className={`max-w-4xl mx-auto px-6 ${isPublic ? '' : 'w-full'}`}>
            {/* HEADER */}
            <div className="text-center mb-12 relative z-10">
                {isPublic && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wide mb-6 border border-indigo-100"
                    >
                        <HelpCircle size={14} /> Centro de Ayuda
                    </motion.div>
                )}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-black mb-6 tracking-tight ${isPublic ? 'text-4xl md:text-6xl text-slate-900' : 'text-3xl md:text-4xl text-slate-900 dark:text-white'}`}
                >
                    {isPublic ? (
                        <>¿Cómo podemos <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ayudarte hoy?</span></>
                    ) : (
                        "Centro de Ayuda"
                    )}
                </motion.h1>

                {/* SEARCH BAR */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative max-w-lg mx-auto"
                >
                    <input
                        type="text"
                        placeholder="Buscar pregunta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full px-6 py-4 pl-12 rounded-2xl border outline-none transition-all text-lg shadow-sm
                        ${isPublic
                                ? 'bg-white border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500'}`}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </motion.div>
            </div>

            {/* CATEGORY TABS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-2 mb-12 relative z-10"
            >
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat.id
                                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                : isPublic
                                    ? 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </motion.div>

            {/* FAQ LIST */}
            <div className="space-y-4 pb-20 relative z-10">
                <AnimatePresence mode='wait'>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <FaqItem key={index} faq={faq} index={index} isPublic={isPublic} />
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <p>No encontramos resultados para "{searchTerm}"</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    if (isPublic) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
                <Navbar />

                <motion.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                    onClick={handleBack}
                    className="fixed top-24 left-6 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg hover:scale-105 transition-all group"
                >
                    <ArrowLeft size={20} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
                </motion.button>

                <div className="pt-32 relative">
                    <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/40 via-purple-50/20 to-transparent blur-3xl transform-gpu"></div>
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
                    </div>

                    {/* Render Variable */}
                    {contentMarkup}
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300">
            {/* Render Variable */}
            {contentMarkup}
        </div>
    );
};

// COMPONENTE ITEM (IGUAL QUE ANTES)
const FaqItem = ({ faq, index, isPublic }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`border rounded-2xl transition-all duration-300 overflow-hidden relative
            ${isPublic
                    ? (isOpen
                        ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100/40 z-10 scale-[1.01]'
                        : 'bg-white border-slate-200 hover:border-indigo-200 z-0')
                    : (isOpen
                        ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-500 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700')
                }`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isOpen
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                        {getIcon(faq.category)}
                    </div>
                    <span className={`font-bold text-lg leading-tight pr-4 ${isPublic ? 'text-slate-800' : 'text-slate-900 dark:text-slate-100'}`}>
                        {faq.q}
                    </span>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}>
                    <ChevronDown size={20} strokeWidth={2.5} />
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
                        <div className={`px-6 pb-8 pl-[5rem] leading-relaxed text-base ${isPublic ? 'text-slate-600' : 'text-slate-600 dark:text-slate-400'}`}>
                            {faq.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const getIcon = (category) => {
    switch (category) {
        case 'Tecnico': return <Zap size={20} />;
        case 'Billing': return <CreditCard size={20} />;
        case 'Privacy': return <Shield size={20} />;
        default: return <FileText size={20} />;
    }
};

export default Faq;