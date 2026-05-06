import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api/config';
import {
  Building2, Globe, Palette, Crown, Key, Loader2,
  ArrowRight, ArrowLeft, Check, Sparkles, Zap, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTenantOrigin } from '../utils/domain';

// ─── API helper ───────────────────────────────────────────────────────────────
const registerTenant = async (data) => {
  const res = await fetch(`${API_URL}/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || 'Error al crear el tenant');
  return json;
};

// ─── Step metadata ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Empresa',  icon: Building2, color: 'from-blue-500 to-cyan-500'    },
  { id: 2, label: 'Diseño',   icon: Palette,   color: 'from-violet-500 to-fuchsia-500' },
  { id: 3, label: 'Admin',    icon: Key,       color: 'from-emerald-500 to-teal-500'  },
  { id: 4, label: 'Lanzar',   icon: Crown,     color: 'from-amber-500 to-orange-500'  },
];

const NICHES = [
  'Software Engineering & IT',
  'Data Science & AI',
  'Marketing & Growth',
  'C-Level & Executive Search',
  'General / Múltiples Industrias',
];

const RESERVED = ['api', 'admin', 'mail', 'www', 'app', 'dashboard', 'veebot'];

// ─── Animation variants ───────────────────────────────────────────────────────
const slide = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.25 } }),
};

// ─── Reusable field components ────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full bg-white/5 border border-white/10
      rounded-xl px-4 py-3 text-white text-sm
      placeholder:text-slate-500
      focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
      transition-all ${className}`}
    {...props}
  />
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);
  const [dir, setDir]         = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const [form, setForm] = useState({
    company_name:   '',
    subdomain:      '',
    ai_niche:       NICHES[0],
    branding: {
      primary_color:   '#0F172A',
      secondary_color: '#3B82F6',
    },
    admin_name:     '',
    admin_email:    '',
    admin_password: '',
  });

  const set = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);
  const setBrand = useCallback((k, v) =>
    setForm(p => ({ ...p, branding: { ...p.branding, [k]: v } })), []);

  const goTo = (n) => { setDir(n > step ? 1 : -1); setStep(n); setErrors({}); };

  // ── Validators ──────────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const e = {};
    if (!form.company_name.trim()) e.company_name = 'Requerido';
    if (!form.subdomain.trim())    e.subdomain = 'Requerido';
    if (RESERVED.includes(form.subdomain)) e.subdomain = 'Subdominio reservado';
    if (!/^[a-z0-9-]{3,30}$/.test(form.subdomain))
      e.subdomain = 'Solo letras minúsculas, números y guiones (3-30 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.admin_name.trim())  e.admin_name = 'Requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.admin_email))
      e.admin_email = 'Email inválido';
    if (form.admin_password.length < 8)
      e.admin_password = 'Mínimo 8 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && !validateStep3()) return;
    goTo(step + 1);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep3()) { goTo(3); return; }
    setLoading(true);
    try {
      const result = await registerTenant(form);
      if (!result.access_token) throw new Error('No se recibió token');

      toast.success('¡Agencia creada! Redirigiendo a tu portal…', { duration: 1500 });

      // Token Handoff pattern — same as Login.jsx.
      // Cookies between localhost ↔ *.localhost are blocked by browsers in dev,
      // so we pass the JWT in the URL to /auth/handoff which runs under the
      // tenant subdomain's origin and writes it to THAT origin's localStorage.
      const handoffUrl = new URL(
        `${getTenantOrigin(result.subdomain)}/auth/handoff`
      );
      handoffUrl.searchParams.set('token', result.access_token);

      window.location.replace(handoffUrl.toString());
    } catch (err) {
      toast.error(err.message || 'Error en el registro');
      setLoading(false);
    }
  };



  const StepIcon = STEPS[step - 1].icon;

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-4 overflow-hidden relative">

      {/* ── Background ambient ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vh] rounded-full blur-[140px] opacity-20"
          style={{ background: form.branding.primary_color }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vh] rounded-full blur-[140px] opacity-15"
          style={{ background: form.branding.secondary_color }}
        />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-2xl font-black text-white tracking-tight">
            VeeBot<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">.ai</span>
          </span>
        </motion.div>

        {/* ── Progress bar ── */}
        <div className="flex items-center gap-2 mb-8 px-1">
          {STEPS.map((s, i) => {
            const done    = step > s.id;
            const current = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => step > s.id && goTo(s.id)}
                  className={`flex items-center gap-1.5 transition-all ${
                    step > s.id ? 'cursor-pointer opacity-60 hover:opacity-100' : 'cursor-default'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all text-xs font-bold
                    ${done    ? 'bg-emerald-500 text-white' : ''}
                    ${current ? 'bg-white text-slate-900 scale-110 shadow-lg shadow-white/20' : ''}
                    ${!done && !current ? 'bg-white/10 text-white/30' : ''}
                  `}>
                    {done ? <Check size={12} strokeWidth={3} /> : s.id}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block transition-colors ${
                    current ? 'text-white' : 'text-white/30'
                  }`}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                      animate={{ width: step > s.id ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Card ── */}
        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden">

          <AnimatePresence mode="wait" custom={dir}>

            {/* ═══ STEP 1: IDENTIDAD ═══ */}
            {step === 1 && (
              <motion.div key="s1" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
                    <Building2 size={13} className="text-blue-400" />
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Paso 1 de 4</span>
                  </div>
                  <h1 className="text-2xl font-black text-white mb-2 leading-tight">
                    Cuéntanos sobre tu agencia
                  </h1>
                  <p className="text-sm text-slate-500">Define tu identidad en la plataforma. Tu subdominio será único.</p>
                </div>

                <div className="space-y-5">
                  <Field label="Nombre de la empresa" error={errors.company_name}>
                    <Input
                      id="company_name"
                      placeholder="Ej. TechRecruiters SA"
                      value={form.company_name}
                      onChange={e => set('company_name', e.target.value)}
                    />
                  </Field>

                  <Field label="Subdominio único" error={errors.subdomain}>
                    <div className="flex">
                      <Input
                        id="subdomain"
                        className="rounded-r-none border-r-0"
                        placeholder="techrecruiters"
                        value={form.subdomain}
                        onChange={e => set('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      />
                      <div className="bg-white/5 border border-white/10 border-l-0 rounded-r-xl px-4 flex items-center">
                        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">.veebot.com</span>
                      </div>
                    </div>
                  </Field>

                  <Field label="Nicho de IA (optimiza el scoring)">
                    <select
                      id="ai_niche"
                      value={form.ai_niche}
                      onChange={e => set('ai_niche', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      {NICHES.map(n => <option key={n} value={n} className="bg-slate-900">{n}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="mt-8 flex justify-end">
                  <StepBtn onClick={handleNext}>Siguiente <ArrowRight size={16} /></StepBtn>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2: BRANDING ═══ */}
            {step === 2 && (
              <motion.div key="s2" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-4">
                    <Palette size={13} className="text-violet-400" />
                    <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Paso 2 de 4</span>
                  </div>
                  <h1 className="text-2xl font-black text-white mb-2">Diseña tu experiencia</h1>
                  <p className="text-sm text-slate-500">Estos colores se aplicarán en todo tu portal de agencia.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Color Principal',  key: 'primary_color',   value: form.branding.primary_color   },
                    { label: 'Color de Acento',  key: 'secondary_color', value: form.branding.secondary_color },
                  ].map(({ label, key, value }) => (
                    <div key={key} className="bg-white/5 border border-white/8 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
                      <div className="flex items-center gap-3">
                        <label
                          className="w-10 h-10 rounded-xl cursor-pointer border-2 border-white/10 overflow-hidden shadow-lg flex-shrink-0"
                          style={{ background: value }}
                        >
                          <input
                            type="color"
                            value={value}
                            onChange={e => setBrand(key, e.target.value)}
                            className="sr-only"
                          />
                        </label>
                        <span className="font-mono text-xs text-slate-400 uppercase">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live preview */}
                <div className="rounded-2xl overflow-hidden border border-white/8 shadow-xl">
                  <div className="bg-white/5 px-3 py-2 flex items-center gap-1.5">
                    {['bg-red-400','bg-yellow-400','bg-green-400'].map(c => (
                      <div key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-60`} />
                    ))}
                    <span className="text-xs text-slate-500 ml-2 font-mono">{form.subdomain || 'tu-agencia'}.veebot.com</span>
                  </div>
                  <div className="flex h-28">
                    <div className="w-14 p-2 flex flex-col gap-2" style={{ background: form.branding.primary_color }}>
                      <div className="w-6 h-6 rounded-full bg-white/20 mx-auto" />
                      <div className="w-5 h-1.5 rounded bg-white/15 mx-auto mt-2" />
                      <div className="w-5 h-1.5 rounded bg-white/10 mx-auto" />
                    </div>
                    <div className="flex-1 bg-slate-900 p-4">
                      <div className="w-24 h-2.5 rounded-full bg-white/10 mb-3" />
                      <div className="w-full h-9 rounded-xl opacity-80" style={{ background: form.branding.secondary_color }} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <BackBtn onClick={() => goTo(1)} />
                  <StepBtn onClick={handleNext}>Siguiente <ArrowRight size={16} /></StepBtn>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3: ADMIN ═══ */}
            {step === 3 && (
              <motion.div key="s3" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-4">
                    <Shield size={13} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Paso 3 de 4</span>
                  </div>
                  <h1 className="text-2xl font-black text-white mb-2">Cuenta de administrador</h1>
                  <p className="text-sm text-slate-500">Esta cuenta tendrá control total sobre la plataforma de tu agencia.</p>
                </div>

                <div className="space-y-5">
                  <Field label="Nombre completo" error={errors.admin_name}>
                    <Input
                      id="admin_name"
                      placeholder="María González"
                      value={form.admin_name}
                      onChange={e => set('admin_name', e.target.value)}
                    />
                  </Field>
                  <Field label="Correo de trabajo" error={errors.admin_email}>
                    <Input
                      id="admin_email"
                      type="email"
                      placeholder="maria@tuagencia.com"
                      value={form.admin_email}
                      onChange={e => set('admin_email', e.target.value)}
                    />
                  </Field>
                  <Field label="Contraseña segura" error={errors.admin_password}>
                    <Input
                      id="admin_password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={form.admin_password}
                      onChange={e => set('admin_password', e.target.value)}
                    />
                    {form.admin_password.length > 0 && (
                      <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full transition-all ${
                            form.admin_password.length < 8 ? 'bg-red-500' :
                            form.admin_password.length < 12 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          animate={{ width: `${Math.min(100, (form.admin_password.length / 16) * 100)}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </Field>
                </div>

                <div className="mt-8 flex justify-between">
                  <BackBtn onClick={() => goTo(2)} />
                  <StepBtn onClick={handleNext}>Continuar <ArrowRight size={16} /></StepBtn>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 4: LANZAR ═══ */}
            {step === 4 && (
              <motion.div key="s4" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
                    <Crown size={30} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-black text-white mb-2">¡Todo listo para despegar!</h1>
                  <p className="text-sm text-slate-500">Elige cómo empezar con <strong className="text-white">{form.company_name}</strong>.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Demo */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="group relative text-left p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all disabled:opacity-50"
                  >
                    <Zap size={20} className="text-slate-400 mb-3" />
                    <h3 className="font-bold text-white mb-1">Demo Gratuita</h3>
                    <p className="text-xs text-slate-500">Comienza de inmediato con funciones limitadas para explorar el sistema.</p>
                    <div className="mt-4 text-xs text-slate-400 font-semibold flex items-center gap-1 group-hover:text-white transition-colors">
                      Iniciar ahora <ArrowRight size={12} />
                    </div>
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                        <Loader2 className="animate-spin text-white" size={22} />
                      </div>
                    )}
                  </button>

                  {/* Premium */}
                  <button
                    onClick={() => {
                      toast('Serás redirigido al pago desde tu Panel', { icon: '💳' });
                      handleSubmit();
                    }}
                    disabled={loading}
                    className="group relative text-left p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-orange-950/30 hover:border-amber-400/50 transition-all disabled:opacity-50 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-amber-500 text-[10px] font-black text-white px-2.5 py-1 rounded-bl-xl uppercase tracking-widest">
                      Pro
                    </div>
                    <Sparkles size={20} className="text-amber-400 mb-3" />
                    <h3 className="font-bold text-amber-300 mb-1">Licencia Agencia</h3>
                    <p className="text-xs text-amber-700/80">Procesamiento masivo, correos automáticos y marca blanca 100%.</p>
                    <div className="mt-4 text-xs text-amber-500 font-semibold flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                      Suscribirse con LemonSqueezy <ArrowRight size={12} />
                    </div>
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                        <Loader2 className="animate-spin text-amber-400" size={22} />
                      </div>
                    )}
                  </button>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 rounded-xl bg-white/3 border border-white/6 space-y-2">
                  {[
                    ['Empresa',    form.company_name],
                    ['Subdominio', `${form.subdomain}.veebot.com`],
                    ['Nicho IA',   form.ai_niche],
                    ['Admin',      form.admin_email],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-slate-500">{k}</span>
                      <span className="text-slate-300 font-medium truncate max-w-[180px] text-right">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-start">
                  <BackBtn onClick={() => goTo(3)} disabled={loading} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-xs text-slate-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => navigate('/login')} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Small shared button components (defined outside to avoid inline components) ─
function StepBtn({ onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-bold
        hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-white/10"
    >
      {children}
    </button>
  );
}

function BackBtn({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500
        hover:text-slate-300 hover:bg-white/5 active:scale-95 transition-all disabled:opacity-40"
    >
      <ArrowLeft size={15} /> Atrás
    </button>
  );
}
