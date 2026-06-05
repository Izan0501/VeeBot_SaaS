import React from 'react';
import { m } from 'framer-motion';
import { FileText } from 'lucide-react';

const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const TermsContact = () => (
    <m.section variants={sectionVariant} className="p-8 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><FileText size={100} /></div>
        <h4 className="font-bold text-xl mb-2 relative z-10 text-slate-900 dark:text-white">Contacto Legal</h4>
        <p className="text-slate-500 dark:text-slate-400 relative z-10">
            Para consultas legales o reportar violaciones, contáctanos en <a aria-label="Interactive control" href="mailto:legal@veebot.ai" className="text-indigo-600 hover:underline font-bold">legal@veebot.ai</a>.
        </p>
    </m.section>
);

export default TermsContact;