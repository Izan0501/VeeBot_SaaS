import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, X, Link as LinkIcon, MessageSquare, Mail, Video, Calendar, 
    Github, Slack, Linkedin, Chrome, AlertCircle, Lock 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Integrations = () => {
    const [connected, setConnected] = useState({
        linkedin: true,
        gmail: false,
        slack: false,
        zoom: false
    });

    const toggleConnection = (key, name) => {
        const newState = !connected[key];
        setConnected({ ...connected, [key]: newState });
        
        if (newState) {
            toast.success(`Conectado exitosamente con ${name}`);
        } else {
            toast(`${name} desconectado`, { icon: '🔌' });
        }
    };

    const containerVars = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 md:px-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                
                {/* HEADER */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Integraciones</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                        Supercarga tu reclutamiento conectando VeeBot con tus herramientas favoritas. Sincronización en tiempo real.
                    </p>
                </motion.div>

                {/* GRID INTEGRACIONES */}
                <motion.div 
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    
                    {/* LINKEDIN (ACTIVO) */}
                    <IntegrationCard 
                        name="LinkedIn Recruiter"
                        desc="Importa candidatos directamente desde perfiles de LinkedIn con un solo clic."
                        icon={<Linkedin size={32} />}
                        color="bg-[#0077b5]"
                        isConnected={connected.linkedin}
                        onToggle={() => toggleConnection('linkedin', 'LinkedIn')}
                        status="Active"
                    />

                    {/* GMAIL */}
                    <IntegrationCard 
                        name="Gmail / G-Suite"
                        desc="Sincroniza correos enviados y agéndalos automáticamente en tu calendario."
                        icon={<Mail size={32} />}
                        color="bg-red-500"
                        isConnected={connected.gmail}
                        onToggle={() => toggleConnection('gmail', 'Gmail')}
                        status="Ready"
                    />

                    {/* SLACK */}
                    <IntegrationCard 
                        name="Slack Notifications"
                        desc="Recibe alertas en tu canal #hiring cuando la IA detecte un candidato Top."
                        icon={<Slack size={32} />}
                        color="bg-[#4A154B]"
                        isConnected={connected.slack}
                        onToggle={() => toggleConnection('slack', 'Slack')}
                        status="Ready"
                    />

                    {/* ZOOM */}
                    <IntegrationCard 
                        name="Zoom Meetings"
                        desc="Genera enlaces de videollamada automáticamente al invitar candidatos."
                        icon={<Video size={32} />}
                        color="bg-[#2D8CFF]"
                        isConnected={connected.zoom}
                        onToggle={() => toggleConnection('zoom', 'Zoom')}
                        status="Ready"
                    />

                    {/* API ACCESS (PREMIUM) */}
                    <motion.div variants={itemVars} className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 opacity-75 hover:opacity-100 transition-all group">
                        <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-full border border-yellow-200">Premium</div>
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-white mb-4 shadow-lg">
                            <code className="font-bold text-lg">{'</>'}</code>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">API Pública</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 h-12">
                            Conecta VeeBot con tu propio ATS o sistema interno mediante nuestra API REST.
                        </p>
                        <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 font-bold text-sm hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
                            <LockIcon size={14}/> Solicitar Acceso
                        </button>
                    </motion.div>

                    {/* COMING SOON */}
                    <motion.div variants={itemVars} className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                            <Calendar size={24} />
                        </div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Google Calendar</h3>
                        <p className="text-xs text-slate-400">Próximamente</p>
                    </motion.div>

                </motion.div>

                {/* BANNER API KEY */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <AlertCircle size={24} className="text-indigo-300" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">¿Eres desarrollador?</h4>
                            <p className="text-indigo-200 text-sm">Puedes crear tus propios plugins usando nuestra documentación.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">
                        <LinkIcon size={18} /> Ver Documentación
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

// Componente de Tarjeta Reutilizable
const IntegrationCard = ({ name, desc, icon, color, isConnected, onToggle, status }) => (
    <motion.div 
        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
        className={`relative rounded-3xl border ${isConnected ? 'border-indigo-500 dark:border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-800'} bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
                {icon}
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {isConnected ? 'Conectado' : status}
                </span>
                
                {/* SWITCH */}
                <button 
                    onClick={onToggle}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${isConnected ? 'bg-green-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                >
                    <motion.div 
                        layout 
                        className="w-4 h-4 bg-white rounded-full shadow-md"
                    />
                </button>
            </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 h-12 leading-relaxed">
            {desc}
        </p>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <span className="text-xs font-medium text-slate-400">
                {isConnected ? 'Sincronización activa' : 'No conectado'}
            </span>
        </div>
    </motion.div>
);

const LockIcon = ({size}) => <Lock size={size} />;

export default Integrations;