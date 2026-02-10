import React from 'react';
import { motion } from 'framer-motion';
import TermsContact from './TermsContact';

const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const termsData = [
    { title: "1. Aceptación", content: "Al acceder y utilizar VeeBot ('el Servicio'), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo, no podrás acceder." },
    { title: "2. Inteligencia Artificial", content: "VeeBot utiliza LLMs avanzados (Llama 3.3). La IA puede cometer errores. La decisión final de contratación es 100% humana." },
    { title: "3. Suscripciones", content: "El servicio se ofrece bajo suscripción mensual. Pagos seguros vía Lemon Squeezy. Cancela cuando quieras desde tu panel." },
    { title: "4. Tus Datos", content: "Tú conservas todos los derechos sobre tus CVs. No vendemos ni compartimos tus datos con terceros." }
];

const TermsContent = () => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="prose prose-slate dark:prose-invert max-w-none space-y-12"
    >
        {termsData.map((section, i) => (
            <motion.section key={i} variants={sectionVariant} className="group hover:pl-4 transition-all duration-300 border-l-2 border-transparent hover:border-indigo-500">
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-indigo-600/50 group-hover:text-indigo-600 transition-colors">#</span> {section.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{section.content}</p>
            </motion.section>
        ))}

        <TermsContact />
    </motion.div>
);

export default TermsContent;