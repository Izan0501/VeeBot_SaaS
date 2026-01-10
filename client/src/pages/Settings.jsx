import React, { useState, useEffect } from 'react';
import {
  User, BrainCircuit, Save, Shield, CreditCard, CheckCircle, Zap, ExternalLink, Star, Crown, Lock, Info, Clock, Activity, AlertTriangle, Trash2, X, AlertOctagon, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');

  // Modales
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Datos
  const [formData, setFormData] = useState({
    name: '', email: '', role: '', minScore: 70, autoReject: false, joinDate: ''
  });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [changingPass, setChangingPass] = useState(false);

  const isPremium = formData.role === 'Premium' || formData.role === 'Admin' || formData.role === 'Reclutador';

  // --- SCROLL & NAV ---
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // --- DATA FETCHING (IGUAL QUE ANTES) ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://127.0.0.1:8000/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '', email: data.email || '', role: data.role || 'Free',
            minScore: data.min_score || 70, autoReject: data.auto_reject || false,
            joinDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : new Date().toLocaleDateString()
          });
        }
      } catch (error) { toast.error("Error cargando perfil"); } finally { setFetching(false); }
    };
    fetchProfile();
  }, []);

  // --- HANDLERS (LOGICA INTACTA) ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { name: formData.name, role: formData.role, min_score: parseInt(formData.minScore), auto_reject: formData.autoReject };
      const res = await fetch('http://127.0.0.1:8000/auth/me', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) toast.success("Perfil actualizado"); else throw new Error();
    } catch { toast.error("Error al guardar"); } finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new) { toast.error("Completa campos"); return; }
    setChangingPass(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/auth/change-password', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: passwords.current, new_password: passwords.new })
      });
      const data = await res.json();
      if (res.ok) { toast.success("Contraseña actualizada"); setPasswords({ current: '', new: '' }); } else { toast.error(data.detail); }
    } catch { toast.error("Error servidor"); } finally { setChangingPass(false); }
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    const toastId = toast.loading("Iniciando pago seguro...");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/payments/create-checkout', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data.checkout_url) window.location.href = data.checkout_url;
      } else throw new Error();
    } catch { toast.error("Error de conexión", { id: toastId }); setUpgradeLoading(false); }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    const toastId = toast.loading("Accediendo a facturación...");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/payments/create-portal', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data.portal_url) window.location.href = data.portal_url;
      } else throw new Error();
    } catch { toast.error("Error al abrir portal", { id: toastId }); } finally { setPortalLoading(false); }
  };

  const handleDeleteClick = () => isPremium ? setShowPremiumAlert(true) : setShowDeleteConfirm(true);

  const confirmDeleteAccount = async () => {
    setDeleting(true);
    const toastId = toast.loading("Eliminando cuenta...");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/auth/me', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        toast.success("Cuenta eliminada.", { id: toastId });
        localStorage.removeItem('token');
        setTimeout(() => { navigate('/'); window.location.reload(); }, 2000);
      } else { const data = await res.json(); throw new Error(data.detail); }
    } catch (error) { toast.error(error.message, { id: toastId }); setDeleting(false); setShowDeleteConfirm(false); }
  };

  const handleAutoRejectToggle = () => {
    if (!isPremium) { toast.error("Función Premium 🔒"); scrollToSection('subscription'); return; }
    setFormData({ ...formData, autoReject: !formData.autoReject });
  };

  // --- VARIANTS FRAMER MOTION ---
  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

// ... (toda la lógica de estados y funciones sigue igual) ...

  if (fetching) return <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950"><div className="animate-pulse text-indigo-600 font-medium">Cargando perfil...</div></div>;

  return (
    // CORRECCIÓN 1: overflow-x-hidden (Para que funcione el Sticky)
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8 md:pt-10 transition-colors duration-300 relative overflow-x-hidden">
      
      {/* CORRECCIÓN 2: Fondo Ambiental REAL (No una caja sólida) */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 pointer-events-none"></div>

      {/* --- MODALES --- */}
      <AnimatePresence>
        {showDeleteConfirm && (
            <ModalOverlay onClose={() => setShowDeleteConfirm(false)}>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500 mx-auto">
                    <AlertOctagon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">¿Eliminar cuenta?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center">
                    Esta acción es <strong>irreversible</strong>. Perderás acceso a todos tus candidatos y configuraciones.
                </p>
                <div className="flex gap-3">
                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
                    <button onClick={confirmDeleteAccount} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-200/50 dark:shadow-none transition-colors">{deleting ? "Borrando..." : "Sí, eliminar"}</button>
                </div>
            </ModalOverlay>
        )}

        {showPremiumAlert && (
            <ModalOverlay onClose={() => setShowPremiumAlert(false)}>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-500 mx-auto">
                    <Crown size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">Suscripción Activa</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center">
                    Debes <strong>cancelar tu plan Premium</strong> antes de eliminar la cuenta para evitar cobros futuros.
                </p>
                <button onClick={() => { setShowPremiumAlert(false); handleManageSubscription(); }} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3">
                    <ExternalLink size={16} /> Ir al Portal
                </button>
                <button onClick={() => setShowPremiumAlert(false)} className="w-full py-2.5 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-800 dark:hover:text-white transition-colors">Volver</button>
            </ModalOverlay>
        )}
      </AnimatePresence>

      <motion.div variants={containerVars} initial="hidden" animate="visible" className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <motion.div variants={itemVars} className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Configuración</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">Gestiona tu perfil y preferencias de IA.</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={loading} className="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/10 transition-all disabled:opacity-70">
            {loading ? <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Save size={18} />}
            <span>{loading ? "Guardando..." : "Guardar Cambios"}</span>
          </motion.button>
        </motion.div>

        {/* CORRECCIÓN 3: items-start para que el sticky no se estire */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR (Columna Izquierda - 4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit z-10 space-y-6">
            
            {/* User Card */}
            <motion.div variants={itemVars} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-800/50"></div>
               <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mb-4 shadow-2xl ${isPremium ? 'bg-gradient-to-tr from-amber-300 to-orange-500 text-white ring-4 ring-white dark:ring-slate-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                  {isPremium && <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-900 p-1 rounded-full"><div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"></div></div>}
               </div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white relative">{formData.name}</h2>
               <p className="text-xs text-slate-400 mb-6 relative">{formData.email}</p>
               
               {isPremium ? 
                  <span className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-700 flex items-center gap-1.5 shadow-sm">
                     <Crown size={14} className="fill-amber-500 text-amber-500"/> Agency Pro
                  </span> 
                  : 
                  <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold border border-slate-200 dark:border-slate-700">Plan Gratuito</span>
               }
            </motion.div>

            {/* Menu Navigation */}
            <motion.div variants={itemVars} className="hidden lg:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-2">
               {[
                 { id: 'profile', icon: <User size={18}/>, label: 'Perfil' },
                 { id: 'subscription', icon: <CreditCard size={18}/>, label: 'Suscripción' },
                 { id: 'ai', icon: <BrainCircuit size={18}/>, label: 'Inteligencia Artificial' },
                 { id: 'security', icon: <Shield size={18}/>, label: 'Seguridad' },
               ].map((item) => (
                 <button 
                    key={item.id} 
                    onClick={() => scrollToSection(item.id)} 
                    className={`w-full flex items-center justify-between px-5 py-4 text-sm font-medium transition-all rounded-2xl mb-1 last:mb-0
                    ${activeSection === item.id 
                        ? 'bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900' 
                        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                 >
                    <div className="flex items-center gap-3">{item.icon} <span>{item.label}</span></div>
                    {activeSection === item.id && <ChevronRight size={16} />}
                 </button>
               ))}
            </motion.div>
          </div>

          {/* MAIN CONTENT (Columna Derecha - 8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. PERFIL */}
            <div id="profile" className="scroll-mt-28">
              <SectionCard title="Información Personal" icon={<User className="text-white" size={20} />} headerColor="bg-blue-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Nombre Completo" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <InputGroup label="Email Corporativo" value={formData.email} disabled={true} icon={<Lock size={14} />} locked={true} />
                  <div className="md:col-span-2 grid grid-cols-2 gap-6">
                     <ReadOnlyField label="ID de Usuario" value="USER-8823-XJ9" icon={<Info size={14} />} />
                     <ReadOnlyField label="Miembro Desde" value={formData.joinDate} icon={<Clock size={14} />} />
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* 2. SUSCRIPCIÓN */}
            <div id="subscription" className="scroll-mt-28">
              <motion.div variants={itemVars}>
                {isPremium ? (
                    // PREMIUM CARD (CON EFECTO VIVO)
                    <div className="relative overflow-hidden rounded-[2rem] border border-amber-500/20 bg-slate-900 shadow-2xl">
                         {/* Background Effects */}
                         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                         <div className="relative p-8 md:p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                                            <Crown size={24} className="text-white" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white">Agency Pro</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm pl-1">Suscripción activa • Renovación automática</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black text-white tracking-tighter">$29</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Mensual</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                <FeatureItem dark text="Análisis Ilimitado" />
                                <FeatureItem dark text="Chat IA (Llama 3.3)" />
                                <FeatureItem dark text="Exportación CSV/JSON" />
                                <FeatureItem dark text="Soporte VIP 24/7" />
                            </div>

                            <div className="flex justify-end pt-6 border-t border-white/10">
                                <button onClick={handleManageSubscription} disabled={portalLoading} className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all">
                                    {portalLoading ? <Loader2 className="animate-spin" size={16}/> : <ExternalLink size={16} />}
                                    <span>Gestionar Suscripción</span>
                                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                                </button>
                            </div>
                         </div>
                    </div>
                ) : (
                    // FREE CARD (UPSELL OSCURO)
                    <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 md:p-10 text-white shadow-2xl transition-transform hover:scale-[1.01] duration-500 border border-slate-800 group">
                        
                        {/* Blobs Animados */}
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></motion.div>
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }} className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></motion.div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase backdrop-blur-md shadow-lg shadow-indigo-900/20">
                                    <Star size={12} className="fill-indigo-300" /> Plan Recomendado
                                </div>
                                
                                <div>
                                    <h3 className="text-4xl font-black tracking-tighter text-white mb-3">Libera el poder de la IA</h3>
                                    <p className="text-indigo-200 text-sm max-w-md leading-relaxed opacity-80">
                                        Elimina los límites de subida, activa el filtrado automático y obtén insights profundos de tus candidatos.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-3">
                                    <FeatureItem dark text="CVs Ilimitados" />
                                    <FeatureItem dark text="Auto-Rechazo" />
                                    <FeatureItem dark text="Soporte 24/7" />
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 min-w-[240px] shadow-2xl relative overflow-hidden group/card">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                                <div className="text-center relative z-10">
                                    <p className="text-5xl font-black text-white tracking-tighter mb-1">$29</p>
                                    <p className="text-xs text-indigo-300 mb-6 uppercase tracking-widest font-bold">USD / mes</p>
                                    
                                    <button onClick={handleUpgrade} disabled={upgradeLoading} className="relative w-full py-4 bg-white text-indigo-950 font-black rounded-2xl overflow-hidden transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] active:scale-95 flex justify-center items-center gap-2 group/btn">
                                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-indigo-100/50 to-transparent skew-x-12"></div>
                                        <span className="relative z-10 flex items-center gap-2">
                                            {upgradeLoading ? <span className="animate-spin h-5 w-5 border-2 border-indigo-900 rounded-full"/> : <Zap size={20} fill="currentColor"/>}
                                            {upgradeLoading ? "Procesando..." : "Mejorar Ahora"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
              </motion.div>
            </div>

            {/* 3. IA PREFS */}
            <div id="ai" className="scroll-mt-28">
              <SectionCard title="Inteligencia Artificial" icon={<BrainCircuit className="text-white" size={20} />} headerColor="bg-purple-600">
                <div className="mb-8 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 border border-purple-100 dark:border-slate-700 rounded-2xl flex gap-4 items-center">
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-purple-600 dark:text-purple-400"><Activity size={24}/></div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Modelo Llama 3.3 (70B)</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Motor semántico optimizado para perfiles IT. Latencia &lt; 800ms.</p>
                    </div>
                </div>

                <div className="space-y-8 px-2">
                  <div>
                    <div className="flex justify-between mb-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Umbral de Coincidencia</label>
                        <p className="text-xs text-slate-400">Score mínimo para "Alto Potencial"</p>
                      </div>
                      <span className="px-3 py-1 h-fit rounded-lg bg-slate-900 text-white text-sm font-bold shadow-md">{formData.minScore}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={formData.minScore} onChange={(e) => setFormData({ ...formData, minScore: e.target.value })} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  <div className={`relative flex items-center justify-between p-6 rounded-2xl border transition-all ${isPremium ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'}`}>
                    <div className="pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Auto-Rechazo Inteligente</h4>
                            {!isPremium && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded border border-amber-200 uppercase">Premium</span>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug max-w-sm">
                            Archivar automáticamente candidatos que no cumplan requisitos técnicos.
                        </p>
                    </div>
                    {isPremium ? (
                        <Toggle enabled={formData.autoReject} onChange={handleAutoRejectToggle} />
                    ) : (
                        <div className="flex items-center gap-3">
                            <Lock size={20} className="text-slate-400" />
                            <Toggle enabled={false} onChange={handleAutoRejectToggle} />
                        </div>
                    )}
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* 4. SEGURIDAD */}
            <div id="security" className="scroll-mt-28 space-y-8">
              <SectionCard title="Seguridad" icon={<Shield className="text-white" size={20} />} headerColor="bg-green-600">
                <div className="space-y-6">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0" size={20} />
                        <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-0.5 font-medium">Usa una contraseña fuerte de al menos 12 caracteres.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup type="password" label="Contraseña Actual" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                        <InputGroup type="password" label="Nueva Contraseña" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={handleChangePassword} disabled={changingPass} className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white dark:bg-white dark:text-slate-900 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95">
                            {changingPass ? "Actualizando..." : "Actualizar Clave"}
                        </button>
                    </div>
                </div>
              </SectionCard>

              {/* DANGER ZONE */}
              <motion.div variants={itemVars} className="rounded-3xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h4 className="text-red-700 dark:text-red-400 font-bold mb-1 flex items-center gap-2"><AlertOctagon size={18}/>ATENCIÓN</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                            Eliminar tu cuenta es irreversible. Se borrarán todos tus datos.
                        </p>
                    </div>
                    <button onClick={handleDeleteClick} className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-sm rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2">
                        <Trash2 size={16} /> Eliminar Cuenta
                    </button>
                  </div>
              </motion.div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- COMPONENTES AUXILIARES REFINADOS ---

const ModalOverlay = ({ children, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
      {children}
    </motion.div>
  </motion.div>
);

const SectionCard = ({ title, icon, children, headerColor = "bg-slate-800" }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none transition-colors overflow-hidden"
  >
    <div className="p-8 pb-0">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 ${headerColor} rounded-2xl shadow-lg shadow-${headerColor.replace('bg-', '')}/30`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
    </div>
    <div className="p-8 pt-0">{children}</div>
  </motion.div>
);

const InputGroup = ({ label, value, onChange, type = "text", disabled = false, icon, locked = false }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3.5 rounded-xl border transition-all text-sm font-medium
                ${locked
            ? 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 cursor-default'
            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          }
            `}
      />
      {locked && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <Lock size={16} />
        </div>
      )}
    </div>
  </div>
);

const ReadOnlyField = ({ label, value, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
    <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center justify-between cursor-default">
      {value}
      <span className="text-slate-300 dark:text-slate-600">{icon}</span>
    </div>
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button onClick={onChange} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const FeatureItem = ({ text, dark }) => (
  <div className={`flex items-center gap-2 text-sm font-medium ${dark ? 'text-indigo-100' : 'text-slate-400'}`}>
    <CheckCircle size={16} className={dark ? "text-indigo-300" : "text-slate-500"} />
    {text}
  </div>
);

export default Settings;