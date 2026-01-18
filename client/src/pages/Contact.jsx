import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MapPin, ArrowLeft, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulación de envío
        setTimeout(() => {
            toast.success("Mensaje enviado correctamente");
            setLoading(false);
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        }, 1500);
    };

    const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
    const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

    // CONTENIDO PRINCIPAL (Adaptable)
    const Content = () => (
        // AGREGADO: overflow-hidden aquí previene el scrollbar causado por las animaciones laterales (x: 50)
        <div className={`flex flex-col lg:flex-row w-full overflow-hidden ${isPublic ? 'min-h-screen pt-20' : 'h-full min-h-full'}`}>

            {/* COLUMNA IZQUIERDA (ARTE) */}
            <div className="lg:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-center p-8 lg:p-20">

                {/* Fondo Animado */}
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen" />

                <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 space-y-8">
                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                        Hablemos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">de futuro.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-md leading-relaxed">
                        ¿Tienes dudas sobre el plan Agency? ¿Quieres una integración a medida? Estamos aquí para ayudarte a escalar.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="space-y-6 pt-8">
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-pink-400 group-hover:bg-pink-500/20 transition-colors"><Mail size={24} /></div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Email Directo</p>
                                <a href="mailto:soporte@veebot.ai" className="text-white hover:text-pink-400 transition-colors text-lg font-medium">veebot7@gmail.com</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors"><MapPin size={24} /></div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Oficinas</p>
                                <p className="text-white text-lg font-medium">Tucumán, Argentina</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* COLUMNA DERECHA (FORMULARIO) */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-white dark:bg-slate-950 relative"
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100/40 via-transparent to-transparent dark:from-indigo-900/10 pointer-events-none"></div>

                <div className="w-full max-w-lg space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Envíanos un mensaje</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Solemos responder en menos de 2 horas.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Nombre" name="firstName" placeholder="Tu nombre" value={formData.firstName} onChange={handleChange} delay={0.1} />
                            <InputGroup label="Apellido" name="lastName" placeholder="Tu apellido" value={formData.lastName} onChange={handleChange} delay={0.2} />
                        </div>
                        <InputGroup label="Email Corporativo" name="email" type="email" placeholder="nombre@empresa.com" value={formData.email} onChange={handleChange} delay={0.3} />

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 block">Mensaje</label>
                            <textarea required name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="¿En qué podemos ayudarte?" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none dark:text-white placeholder:text-slate-400 font-medium"></textarea>
                        </motion.div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-4 bg-slate-900 hover:bg-pink-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            {loading ? "Enviando..." : "Enviar Mensaje"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );

    if (isPublic) {
        return (
            // AGREGADO: overflow-x-hidden para prevenir scroll horizontal en mobile/public
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 selection:bg-pink-500 selection:text-white overflow-x-hidden relative">
                <Navbar />

                <motion.button
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                    onClick={handleBack}
                    className="fixed top-24 left-6 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:scale-105 transition-all group"
                >
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-pink-600 transition-colors" />
                </motion.button>

                <Content />
                <Footer />
            </div>
        );
    }

    // CAMBIO CLAVE AQUÍ: overflow-hidden en el contenedor del dashboard
    return (
        <div className="w-full h-full min-h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <Content />
        </div>
    );
};

const InputGroup = ({ label, name, type = "text", placeholder, value, onChange, delay }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="space-y-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">{label}</label>
        <input required type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white placeholder:text-slate-400 font-medium" />
    </motion.div>
);

export default Contact;