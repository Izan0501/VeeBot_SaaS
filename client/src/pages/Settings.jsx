import React, { useState, useEffect } from 'react';
import {
  User, BrainCircuit, Save, Shield, CreditCard, CheckCircle, Zap, ExternalLink, Star, Crown, ChevronRight, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');

  // --- ESTADOS ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    minScore: 70,
    autoReject: false
  });

  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [changingPass, setChangingPass] = useState(false);

  const isPremium = formData.role === 'Premium' || formData.role === 'Admin' || formData.role === 'Reclutador';

  // --- SCROLL ---
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 1. CARGAR DATOS
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
            name: data.name || '',
            email: data.email || '',
            role: data.role || 'Free',
            minScore: data.min_score || 70,
            autoReject: data.auto_reject || false
          });
        }
      } catch (error) {
        toast.error("Error cargando perfil");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. GUARDAR
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        role: formData.role,
        min_score: parseInt(formData.minScore),
        auto_reject: formData.autoReject
      };
      const res = await fetch('http://127.0.0.1:8000/auth/me', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) toast.success("Perfil actualizado");
      else throw new Error();
    } catch { toast.error("Error al guardar"); } finally { setLoading(false); }
  };

  // 3. PASSWORD
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
      if (res.ok) {
        toast.success("Contraseña actualizada");
        setPasswords({ current: '', new: '' });
      } else { toast.error(data.detail); }
    } catch { toast.error("Error servidor"); } finally { setChangingPass(false); }
  };

  // 4. UPGRADE
  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    const toastId = toast.loading("Iniciando pago seguro...");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/payments/create-checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkout_url) window.location.href = data.checkout_url;
      } else throw new Error();
    } catch {
      toast.error("Error de conexión", { id: toastId });
      setUpgradeLoading(false);
    }
  };

  // 5. PORTAL
  const handleManageSubscription = async () => {
    setPortalLoading(true);
    const toastId = toast.loading("Accediendo a facturación...");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/payments/create-portal', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.portal_url) window.location.href = data.portal_url;
      } else throw new Error();
    } catch {
      toast.error("Error al abrir portal", { id: toastId });
    } finally { setPortalLoading(false); }
  };

  if (fetching) return <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950"><div className="animate-pulse text-indigo-600 font-medium">Cargando...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8 md:pt-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Configuración</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestiona tu cuenta y preferencias.</p>
          </div>
          <button onClick={handleSave} disabled={loading} className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70">
            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
            <span>{loading ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* SIDEBAR NAVIGATION */}
          <div className="space-y-6">
            {/* User Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-3 shadow-lg ${isPremium ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{formData.name}</h2>
              <div className="mt-2">
                {isPremium ?
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-700 flex items-center gap-1 mx-auto w-fit">
                    <Crown size={12} className="fill-amber-500 text-amber-500" /> Agency Pro
                  </span>
                  :
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold border border-slate-200 dark:border-slate-700">Plan Gratuito</span>
                }
              </div>
            </div>

            {/* Menu */}
            <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24">
              {[
                { id: 'profile', icon: <User size={18} />, label: 'Perfil' },
                { id: 'subscription', icon: <CreditCard size={18} />, label: 'Suscripción' },
                { id: 'ai', icon: <BrainCircuit size={18} />, label: 'IA & Preferencias' },
                { id: 'security', icon: <Shield size={18} />, label: 'Seguridad' },
              ].map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-medium transition-all border-l-4 ${activeSection === item.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'}`}>
                  {item.icon} <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. PERFIL */}
            <div id="profile" className="scroll-mt-28">
              <SectionCard title="Información Personal" icon={<User className="text-indigo-600 dark:text-indigo-400" size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Rol</label>
                    <input type="text" value={formData.role} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed" />
                  </div>
                  <div className="md:col-span-2"><InputGroup label="Email" value={formData.email} disabled={true} /></div>
                </div>
              </SectionCard>
            </div>

            {/* 2. SUSCRIPCIÓN (DISEÑO PREMIUM) */}
            <div id="subscription" className="scroll-mt-28">
              {isPremium ? (
                // --- VISTA PREMIUM ACTIVA ---
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl transition-all">
                  {/* Header Degradado */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-indigo-950 dark:to-slate-900"></div>
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Crown size={120} className="text-white transform rotate-12" /></div>

                  <div className="relative px-8 pt-8 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 shadow-lg flex items-center justify-center text-white">
                          <Crown size={32} fill="currentColor" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white tracking-tight">Agency Pro</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-500 text-white shadow-sm">
                              <CheckCircle size={10} /> ACTIVO
                            </span>
                            <span className="text-indigo-200 text-xs font-medium">Renovación automática</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-3xl font-black text-white">$29<span className="text-lg text-indigo-300 font-normal">/mes</span></p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Tu poder actual</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {['Análisis de CVs Ilimitado', 'Chat con IA (Modelo Llama 3.3)', 'Soporte Prioritario VIP', 'Exportación de Datos'].map((feat, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"><CheckCircle size={14} /></div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                        <button
                          onClick={handleManageSubscription}
                          disabled={portalLoading}
                          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-bold text-sm flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          {portalLoading ? <span className="animate-spin h-3 w-3 border-2 border-current rounded-full" /> : <ExternalLink size={16} />}
                          Administrar Suscripción
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // --- VISTA FREE (UPSELL POTENTE) ---
                <div className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl group">
                  <div className="bg-white dark:bg-slate-950 rounded-[22px] p-8 h-full relative overflow-hidden">

                    {/* Glow de fondo */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">Recomendado</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Agency Pro</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Elimina límites. Contrata más rápido.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-black text-slate-900 dark:text-white">$29</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">USD / mes</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"><Zap size={18} /></div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white text-sm">IA Sin Límites</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Procesa cientos de CVs en minutos.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"><BrainCircuit size={18} /></div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white text-sm">Chat RAG Inteligente</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Pregunta a tus CVs como si fueras un experto.</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleUpgrade}
                      disabled={upgradeLoading}
                      className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 relative z-10"
                    >
                      {upgradeLoading ? <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" /> : <Star size={20} className="fill-current" />}
                      {upgradeLoading ? "Procesando..." : "Desbloquear Acceso Total"}
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                      <Lock size={12} /> Pago seguro vía Lemon Squeezy. Cancela cuando quieras.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. IA PREFS */}
            <div id="ai" className="scroll-mt-28">
              <SectionCard title="Configuración de IA" icon={<BrainCircuit className="text-purple-600 dark:text-purple-400" size={20} />}>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Umbral de Coincidencia</label>
                      <span className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold">{formData.minScore}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={formData.minScore} onChange={(e) => setFormData({ ...formData, minScore: e.target.value })} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div><h4 className="text-sm font-bold text-slate-800 dark:text-white">Auto-Rechazo</h4><p className="text-xs text-slate-500 dark:text-slate-400">Archivar CVs con bajo puntaje.</p></div>
                    <Toggle enabled={formData.autoReject} onChange={() => setFormData({ ...formData, autoReject: !formData.autoReject })} />
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* 4. SEGURIDAD */}
            <div id="security" className="scroll-mt-28">
              <SectionCard title="Seguridad" icon={<Shield className="text-green-600 dark:text-green-400" size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup type="password" label="Contraseña Actual" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                  <InputGroup type="password" label="Nueva Contraseña" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={handleChangePassword} disabled={changingPass} className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Actualizar</button>
                </div>
              </SectionCard>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const InputGroup = ({ label, value, onChange, type = "text", disabled = false }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{label}</label>
    <input type={type} value={value} onChange={onChange} disabled={disabled} className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-all ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} />
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button onClick={onChange} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

export default Settings;