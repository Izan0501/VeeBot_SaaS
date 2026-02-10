import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';

// --- IMPORTS COMPONENTES FAQ ---
import FaqHeader from '../components/faq/FaqHeader';
import FaqCategories from '../components/faq/FaqCategories';
import FaqItem from '../components/faq/FaqItem';

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

    // --- RENDERIZADO DEL CONTENIDO PRINCIPAL ---
    const contentMarkup = (
        <div className={`max-w-5xl mx-auto px-6 ${isPublic ? '' : 'w-full'}`}>
            <FaqHeader isPublic={isPublic} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <FaqCategories categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

            {/* FAQ LIST */}
            <motion.div layout className="space-y-5 pb-24 relative z-10 max-w-3xl mx-auto">
                <AnimatePresence initial={false}>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <FaqItem key={faq.q} faq={faq} />
                        ))
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
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

    // --- RENDERIZADO CONDICIONAL (PÚBLICO VS DASHBOARD) ---
    if (isPublic) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">

                {/* Navbar eliminado (Lo maneja el Layout) */}

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

                {/* Footer eliminado (Lo maneja el Layout) */}
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            {contentMarkup}
        </div>
    );
};

export default Faq;