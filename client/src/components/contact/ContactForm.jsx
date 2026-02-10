import React from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import FormInput from '../common/FormInput';

const ContactForm = ({ formData, handleChange, handleSubmit, loading, isPublic, wrapperClasses }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={wrapperClasses}
    >
        {/* Degradado de fondo sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-100/40 via-transparent to-transparent dark:from-indigo-900/10 pointer-events-none"></div>

        <div className="w-full max-w-lg space-y-6 md:space-y-8 relative z-10">
            <div className="text-center lg:text-left xl:text-left">
                <h2 className={`font-bold text-slate-900 dark:text-white tracking-tight ${isPublic ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>Envíanos un mensaje</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">Solemos responder en menos de 2 horas.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormInput label="Nombre" name="firstName" placeholder="Tu nombre" value={formData.firstName} onChange={handleChange} delay={0.1} />
                    <FormInput label="Apellido" name="lastName" placeholder="Tu apellido" value={formData.lastName} onChange={handleChange} delay={0.2} />
                </div>
                <FormInput label="Email Corporativo" name="email" type="email" placeholder="nombre@empresa.com" value={formData.email} onChange={handleChange} delay={0.3} />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 block">Mensaje</label>
                    <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="¿En qué podemos ayudarte?"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none dark:text-white placeholder:text-slate-400 font-medium text-sm md:text-base"
                    ></textarea>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 hover:bg-pink-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                </motion.button>
            </form>
        </div>
    </motion.div>
);

export default ContactForm;