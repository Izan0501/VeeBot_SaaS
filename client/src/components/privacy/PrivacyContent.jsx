import React from 'react';
import { motion } from 'framer-motion';

const PrivacyContent = () => (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="space-y-12 prose prose-slate dark:prose-invert max-w-none"
    >
        <section>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Información que Recopilamos</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-lg">Recopilamos solo lo necesario:</p>
            <ul className="list-none space-y-3 pl-0">
                {['Datos de cuenta (Nombre, Email, Pass encriptada)', 'Datos de facturación (Procesados por Lemon Squeezy)', 'Datos de uso (CVs y Vectores)'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {item}
                    </li>
                ))}
            </ul>
        </section>

        <section>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. Almacenamiento y Seguridad</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                Utilizamos <strong>MongoDB Atlas</strong> con encriptación en reposo y <strong>Pinecone</strong> para vectores. Toda la comunicación es SSL/TLS (HTTPS).
            </p>
        </section>

        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 text-center font-medium">
                ¿Preguntas de seguridad? <a href="mailto:security@veebot.ai" className="text-emerald-600 hover:underline">security@veebot.ai</a>
            </p>
        </section>
    </motion.div>
);

export default PrivacyContent;