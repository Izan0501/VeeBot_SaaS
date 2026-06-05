import React from 'react';
import { m } from 'framer-motion';

const TrustBadges = ({ itemVariants }) => {
    return (
        <m.div variants={itemVariants} className="text-center opacity-50 pb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                Pagos seguros encriptados SSL
            </p>
            <div className="flex justify-center items-center gap-8 grayscale opacity-70">
                {/* Simulamos los logos con texto estilizado para no depender de imágenes externas */}
                <div className="font-serif text-2xl font-black italic text-slate-400">Visa</div>
                <div className="font-sans text-xl font-black text-slate-400">Mastercard</div>
                <div className="font-mono text-xl font-bold text-slate-400">Stripe</div>
                <div className="font-sans text-xl font-bold text-slate-400">PayPal</div>
            </div>
        </m.div>
    );
};

export default TrustBadges;