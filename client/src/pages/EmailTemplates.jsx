import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Save, CheckCircle, XCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState({
        rejection: { subject: "", body: "" },
        interview: { subject: "", body: "" }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/settings/templates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const toastId = toast.loading("Guardando plantillas...");
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/settings/templates', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ templates })
            });
            if (res.ok) {
                toast.success("Plantillas actualizadas", { id: toastId });
            } else throw new Error();
        } catch {
            toast.error("Error al guardar", { id: toastId });
        }
    };

    const handleChange = (type, field, value) => {
        setTemplates(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Cargando editor...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Editor de Emails</h1>
                        <p className="text-slate-500 dark:text-slate-400">Automatiza tu comunicación manteniendo un toque personal.</p>
                    </div>
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
                        <Save size={18} /> Guardar Cambios
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 gap-8">
                    {/* INFO VARIABLES */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4 rounded-xl flex gap-3 items-start text-sm text-indigo-800 dark:text-indigo-300">
                        <Info className="shrink-0 mt-0.5" size={18} />
                        <div>
                            <strong>Variables disponibles:</strong> Usa <code className="bg-white dark:bg-indigo-950 px-1 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">{`{name}`}</code>, <code className="bg-white dark:bg-indigo-950 px-1 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">{`{role}`}</code>, <code className="bg-white dark:bg-indigo-950 px-1 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">{`{score}`}</code> y <code className="bg-white dark:bg-indigo-950 px-1 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">{`{company}`}</code> en el asunto o cuerpo. Se reemplazarán automáticamente al enviar.
                        </div>
                    </div>

                    {/* PLANTILLA ENTREVISTA */}
                    <TemplateCard
                        title="Invitación a Entrevista"
                        icon={<CheckCircle className="text-green-500" />}
                        data={templates.interview}
                        onChange={(field, val) => handleChange('interview', field, val)}
                    />

                    {/* PLANTILLA RECHAZO */}
                    <TemplateCard
                        title="Email de Rechazo"
                        icon={<XCircle className="text-red-500" />}
                        data={templates.rejection}
                        onChange={(field, val) => handleChange('rejection', field, val)}
                    />
                </div>
            </div>
        </div>
    );
};

const TemplateCard = ({ title, icon, data, onChange }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
    >
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{icon}</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Asunto</label>
                <input
                    type="text"
                    value={data.subject}
                    onChange={(e) => onChange('subject', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cuerpo del Mensaje</label>
                <textarea
                    value={data.body}
                    onChange={(e) => onChange('body', e.target.value)}
                    rows={6}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                />
            </div>
        </div>
    </motion.div>
);

export default EmailTemplates;