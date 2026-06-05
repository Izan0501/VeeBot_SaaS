import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { m } from 'framer-motion';

// --- IMPORTS COMPONENTES ---
import ContactVisuals from '../components/contact/ContactVisuals';
import ContactForm from '../components/contact/ContactForm';

const Contact = ({ isPublic = true }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', message: ''
    });

    const handleBack = () => {
        if (isPublic) navigate('/');
        else navigate('/dashboard');
    };

    const handleFieldChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const submitContactForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success("Mensaje enviado correctamente");
            setLoading(false);
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        }, 1500);
    };

    // --- CLASES DINÁMICAS ---
    const wrapperClasses = isPublic
        // CORRECCIÓN: Se eliminó "pt-20" para quitar la barra negra vacía superior
        ? "flex flex-col lg:flex-row w-full min-h-screen bg-slate-50 dark:bg-slate-950"
        : "flex flex-col xl:flex-row size-full min-h-[calc(100vh-100px)] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm";

    const leftColClasses = isPublic
        ? "w-full lg:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-center px-8 py-16 md:p-16 lg:p-20 min-h-fit h-auto lg:h-auto lg:min-h-full"
        : "w-full xl:w-5/12 bg-slate-900 relative overflow-hidden flex flex-col justify-center px-8 py-12 md:p-12 min-h-fit h-auto xl:h-auto xl:min-h-full";

    const rightColClasses = isPublic
        ? "w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white dark:bg-slate-950 relative min-h-[600px] lg:min-h-full"
        : "w-full xl:w-7/12 flex items-center justify-center p-6 md:p-10 bg-white dark:bg-slate-900 relative h-full";

    // Contenido compartido
    const contentMarkup = (
        <div className={wrapperClasses}>
            <ContactVisuals isPublic={isPublic} wrapperClasses={leftColClasses} />
            <ContactForm
                formData={formData}
                handleFieldChange={handleFieldChange}
                submitContactForm={submitContactForm}
                loading={loading}
                isPublic={isPublic}
                wrapperClasses={rightColClasses}
            />
        </div>
    );

    // Renderizado Condicional
    if (isPublic) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-white dark:text-white transition-colors duration-300 selection:bg-pink-500 selection:text-white overflow-x-hidden flex flex-col">
                <m.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                    onClick={handleBack}
                    // Ajuste estético: cambié top-24 a top-6 para que no quede flotando tan abajo ahora que quitamos el padding
                    className="fixed top-6 left-4 lg:left-8 z-40 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:scale-105 transition-all group"
                >
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-pink-600 transition-colors" />
                </m.button>

                <main className="flex-grow flex flex-col">
                    {contentMarkup}
                </main>
            </div>
        );
    }

    return (
        <div className="size-full p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full">
                {contentMarkup}
            </div>
        </div>
    );
};

export default Contact;