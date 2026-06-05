/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

// --- IMPORTS API ---
import { communicationsAPI } from '../api/communications';

// --- IMPORTS COMPONENTES ---
import EmailHeader from '../components/emails/EmailHeader';
import TemplateCard from '../components/emails/TemplateCard';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState({
        rejection: { subject: "", body: "" },
        interview: { subject: "", body: "" }
    });
    const [loading, setLoading] = useState(true);

    // eslint-disable-next-line react-doctor/no-initialize-state
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await communicationsAPI.getTemplates();
                if (data.rejection) {
                    setTemplates(data);
                }
            } catch (error) {
                console.error(error);
                // toast.error("Error al cargar plantillas"); // Opcional
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSave = async () => {
        const toastId = toast.loading("Guardando plantillas…");
        try {
            await communicationsAPI.saveTemplates(templates);
            toast.success("Plantillas actualizadas", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error al guardar", { id: toastId });
        }
    };

    const handleChange = (type, field, value) => {
        setTemplates(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950 text-slate-500">Cargando editor…</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors">
            <div className="max-w-4xl mx-auto">

                <EmailHeader onSave={handleSave} />

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

export default EmailTemplates;