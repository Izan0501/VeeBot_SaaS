import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// --- IMPORTS API ---
import { paymentsAPI } from '../api/payments';
import { authAPI } from '../api/auth';

// --- IMPORTS COMPONENTES ---
import PricingHeader from '../components/upgrade/PricingHeader';
import PricingCard from '../components/upgrade/PricingCard';
import ComparisonTable from '../components/upgrade/ComparisonTable';
import TrustBadges from '../components/upgrade/TrustBadges'; // <--- IMPORTAMOS AQUÍ

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };




const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };



const Upgrade = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 1. VERIFICAR STATUS ACTUAL
    useEffect(() => {
        const verifyCurrentStatus = async () => {
            try {
                const user = await authAPI.getMe();
                if (['Premium', 'Agency', 'Agency Pro'].includes(user.role)) {
                    navigate('/dashboard', { replace: true });
                }
            } catch (error) {
                console.error("Error verificando suscripción", error);
            }
        };
        verifyCurrentStatus();
    }, [navigate]);

    // 2. ESCUCHA DE EVENTOS LEMON SQUEEZY
    useEffect(() => {
        const handleLemonEvent = (event) => {
            if (event.data && event.data.event === 'LemonSqueezy.Payment.Success') {
                toast.success("¡Pago exitoso! Actualizando tu cuenta…", { duration: 4000, icon: '🚀' });
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                    window.location.reload();
                }, 2000);
            }
        };
        window.addEventListener('message', handleLemonEvent);
        return () => window.removeEventListener('message', handleLemonEvent);
    }, [navigate]);

    // 3. HANDLER DE PAGO
    const handleCheckout = async () => {
        setLoading(true);
        try {
            const data = await paymentsAPI.createCheckout();
            if (window.LemonSqueezy) {
                window.LemonSqueezy.Url.Open(data.checkout_url);
            } else {
                window.location.href = data.checkout_url;
            }
        } catch (error) {
            console.error(error);
            toast.error("No se pudo iniciar el pago. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-size-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans pb-20">
            {/* FONDO AMBIENTAL */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 size-[800px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-7xl mx-auto px-6 pt-16"
            >
                <PricingHeader itemVariants={itemVariants} />

                <PricingCard itemVariants={itemVariants} onCheckout={handleCheckout} loading={loading} />

                <ComparisonTable itemVariants={itemVariants} />

                {/* Usamos el componente modularizado */}
                <TrustBadges itemVariants={itemVariants} />

            </m.div>
        </div>
    );
};

export default Upgrade;