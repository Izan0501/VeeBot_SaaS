import React, { useState, useEffect } from 'react';
import {
  User, BrainCircuit, Save, Shield, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');

  // --- ESTADOS UNIFICADOS ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    minScore: 70,
    autoReject: false
  });

  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [changingPass, setChangingPass] = useState(false);

  // --- FUNCIÓN DE SCROLL CORREGIDA (Usa scrollIntoView) ---
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);

    if (element) {
      // scrollIntoView busca automáticamente el contenedor con scroll (sea window o un div)
      // y mueve el elemento a la vista.
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start' // Alinea el elemento al inicio
      });
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
            role: data.role || '',
            minScore: data.min_score || 70,
            autoReject: data.auto_reject || false
          });
        }
      } catch (error) {
        console.error("Error cargando perfil", error);
        toast.error("No se pudo cargar la información del perfil");
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
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Perfil actualizado correctamente");
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // 3. CAMBIAR PASSWORD
  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new) {
      toast.error("Completa ambos campos");
      return;
    }
    setChangingPass(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.new
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Contraseña actualizada");
        setPasswords({ current: '', new: '' });
      } else {
        toast.error(data.detail || "Error al cambiar contraseña");
      }
    } catch (error) {
      toast.error("Error de servidor");
    } finally {
      setChangingPass(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-pulse text-indigo-600 font-medium">Cargando perfil...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8 md:pt-10 transition-colors duration-300">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Mi Perfil & Configuración</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administra tus datos personales y preferencias de IA.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={18} />}
            <span>{loading ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* COLUMNA IZQUIERDA (PANEL LATERAL) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center transition-colors">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 mb-4 shadow-xl shadow-indigo-100 dark:shadow-none">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name || 'Usuario'}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{formData.role || 'Sin Rol Asignado'}</p>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Cuenta Activa
              </span>
            </div>

            {/* MENÚ DE NAVEGACIÓN LATERAL (STICKY) */}
            {/* 'sticky top-24' hace que se quede fijo al hacer scroll en desktop */}
            <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors sticky top-24">

              <button
                onClick={() => scrollToSection('profile')}
                className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-medium transition-all duration-200 border-l-4 ${activeSection === 'profile'
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'
                  }`}
              >
                <User size={18} /> <span>Perfil General</span>
              </button>

              <button
                onClick={() => scrollToSection('ai')}
                className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-medium transition-all duration-200 border-l-4 ${activeSection === 'ai'
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'
                  }`}
              >
                <BrainCircuit size={18} /> <span>Ajustes de IA</span>
              </button>

              <button
                onClick={() => scrollToSection('security')}
                className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-medium transition-all duration-200 border-l-4 ${activeSection === 'security'
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'
                  }`}
              >
                <Shield size={18} /> <span>Seguridad</span>
              </button>

            </div>
          </div>

          {/* COLUMNA DERECHA (FORMULARIOS) */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">

            {/* SECCIÓN 1: PERFIL */}
            {/* scroll-mt-28 asegura que al scrollear no quede tapado por el header */}
            <div id="profile" className="scroll-mt-28">
              <SectionCard title="Información Personal" icon={<User className="text-indigo-600 dark:text-indigo-400" size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup
                    label="Nombre Completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <InputGroup
                    label="Cargo / Rol"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Email (No editable)"
                      value={formData.email}
                      disabled={true}
                    />
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* SECCIÓN 2: IA PREFERENCES */}
            <div id="ai" className="scroll-mt-28">
              <SectionCard title="Configuración de VeeBot AI" icon={<BrainCircuit className="text-purple-600 dark:text-purple-400" size={20} />}>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Umbral Mínimo de Coincidencia</label>
                      <span className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold">{formData.minScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.minScore}
                      onChange={(e) => setFormData({ ...formData, minScore: e.target.value })}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                      Los candidatos con un puntaje inferior a <strong>{formData.minScore}%</strong> serán clasificados automáticamente como "Bajo Potencial".
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 md:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="pr-4">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Auto-Rechazo Inteligente</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">Archivar automáticamente CVs que no cumplan requisitos técnicos excluyentes.</p>
                    </div>
                    <Toggle
                      enabled={formData.autoReject}
                      onChange={() => setFormData({ ...formData, autoReject: !formData.autoReject })}
                    />
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 text-center">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      * Motor IA actual: Llama 3.3 (70B) via Groq
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* SECCIÓN 3: SEGURIDAD */}
            <div id="security" className="scroll-mt-28">
              <SectionCard title="Seguridad" icon={<Shield className="text-green-600 dark:text-green-400" size={20} />}>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Cambiar Contraseña</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="password"
                        placeholder="Contraseña Actual"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                      />
                      <input
                        type="password"
                        placeholder="Nueva Contraseña"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={changingPass}
                      className="w-full md:w-auto px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      {changingPass && <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />}
                      Actualizar Contraseña
                    </button>
                  </div>
                </div>
              </SectionCard>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTES ---

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
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}`}
    />
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
  >
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

export default Settings;