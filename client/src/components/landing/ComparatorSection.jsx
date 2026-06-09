import React, { useState, useEffect, useRef } from 'react';
import { m, useInView, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Target, Brain, ChevronRight, Swords } from 'lucide-react';

// ─── DATA MOCK ─────────────────────────────────────────────────────────────
const CANDIDATE_A = {
  name: 'María González',
  role: 'Senior Frontend Engineer',
  score: 91,
  skills: ['React', 'TypeScript', 'Three.js', 'GraphQL'],
  advantages: ['5 años en startups de escala', 'Portfolio con 3M usuarios', 'Open source contributor'],
  color: 'from-violet-600 to-indigo-600',
  glow: 'rgba(139,92,246,0.4)',
  accent: '#8b5cf6',
  side: 'A',
};

const CANDIDATE_B = {
  name: 'Carlos Reyes',
  role: 'Full Stack Developer',
  score: 84,
  skills: ['Node.js', 'React', 'AWS', 'Docker'],
  advantages: ['Infraestructura para 500k DAU', 'Team lead 8 personas', 'Reduce costos 40%'],
  color: 'from-rose-600 to-pink-600',
  glow: 'rgba(244,63,94,0.4)',
  accent: '#f43f5e',
  side: 'B',
};

// ─── SCORE RING ─────────────────────────────────────────────────────────────
const ScoreRing = ({ score, color, isWinner }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div ref={ref} className="relative size-24 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <m.circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="relative z-10 text-center">
        <m.span
          className="text-2xl font-black text-neutral-900 dark:text-white block leading-none transition-colors duration-300 ease-in-out"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          {score}
        </m.span>
        <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out">Score</span>
      </div>
      {isWinner && (
        <m.div
          className="absolute -top-1 -right-1 size-6 bg-amber-400 rounded-full flex items-center justify-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 1.2 }}
        >
          <Trophy size={12} className="text-amber-900" />
        </m.div>
      )}
    </div>
  );
};

// ─── CANDIDATE CARD ──────────────────────────────────────────────────────────
const CandidateCard = ({ candidate, delay = 0, align = 'left' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = align === 'left';

  return (
    <m.div
      ref={ref}
      className="flex-1 min-w-0 relative"
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay }}
    >
      {/* Glow behind card */}
      <div
        className="absolute inset-0 rounded-3xl opacity-20 blur-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at ${isLeft ? '80%' : '20%'} 40%, ${candidate.glow}, transparent 70%)` }}
      />

      <div className={`relative rounded-3xl p-6 md:p-8 h-full backdrop-blur-sm transform-gpu group transition-all duration-300 ease-in-out ${
        candidate.score > 85
          ? 'bg-white shadow-xl shadow-indigo-500/10 border-2 border-indigo-500 z-10 dark:bg-neutral-900/80 dark:border-indigo-500/50 dark:shadow-indigo-500/20'
          : 'bg-neutral-200/50 border border-neutral-300 text-neutral-500 dark:bg-neutral-900/30 dark:border-neutral-800 dark:text-neutral-500'
      }`}>
        {candidate.score > 85 && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg z-20">
                Recomendado
            </div>
        )}
        {/* Hover inner glow */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at ${isLeft ? '100%' : '0%'} 0%, ${candidate.glow.replace('0.4', '0.08')}, transparent 60%)` }}
        />

        <div className={`flex items-start gap-4 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <ScoreRing score={candidate.score} color={candidate.accent} isWinner={candidate.score > 85} />
          <div className={`min-w-0 ${isLeft ? '' : 'text-right'}`}>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 ${isLeft ? '' : 'flex-row-reverse'}`}
              style={{ background: `${candidate.glow.replace('0.4', '0.15')}`, color: candidate.accent }}>
              <Target size={9} />
              Candidato {candidate.side}
            </div>
            <h3 className="text-neutral-900 dark:text-white font-bold text-xl leading-tight truncate transition-colors duration-300 ease-in-out">{candidate.name}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-0.5 transition-colors duration-300 ease-in-out">{candidate.role}</p>
          </div>
        </div>

        {/* Skills */}
        <div className={`flex flex-wrap gap-2 mt-6 ${isLeft ? '' : 'justify-end'}`}>
          {candidate.skills.map((skill, i) => (
            <m.span
              key={skill}
              className="px-3 py-1 rounded-lg text-[11px] font-semibold border"
              style={{ borderColor: `${candidate.accent}30`, color: candidate.accent, background: `${candidate.accent}10` }}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: delay + 0.3 + i * 0.07 }}
            >
              {skill}
            </m.span>
          ))}
        </div>

        {/* Advantages */}
        <ul className={`mt-5 space-y-2.5 ${isLeft ? '' : 'items-end'} flex flex-col`}>
          {candidate.advantages.map((adv, i) => (
            <m.li
              key={adv}
              className={`flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300 ease-in-out ${isLeft ? '' : 'flex-row-reverse'}`}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: delay + 0.5 + i * 0.1 }}
            >
              <ChevronRight size={14} style={{ color: candidate.accent, flexShrink: 0 }} className={isLeft ? '' : 'rotate-180'} />
              {adv}
            </m.li>
          ))}
        </ul>
      </div>
    </m.div>
  );
};

// ─── VS DIVIDER ──────────────────────────────────────────────────────────────
const VsDivider = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex-shrink-0 flex flex-col items-center justify-center gap-3 relative z-10 py-4">
      {/* Top line */}
      <m.div
        className="w-px bg-gradient-to-b from-transparent via-white/20 to-white/40"
        style={{ height: 80 }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* VS Badge */}
      <m.div
        className="relative"
        initial={{ scale: 0.95, rotate: -20 }}
        animate={inView ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.5 }}
      >
        {/* Electric pulse ring */}
        <m.div
          className="absolute inset-[-8px] rounded-full border border-violet-500/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <m.div
          className="absolute inset-[-16px] rounded-full border border-rose-500/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
        />

        <div className="relative size-14 rounded-full border border-white/15 bg-[#0a0a0f] flex items-center justify-center"
          style={{ boxShadow: '0 0 30px rgba(139,92,246,0.2), 0 0 60px rgba(244,63,94,0.15)' }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.1rem',
            letterSpacing: '0.05em'
          }} className="text-indigo-400">VS</span>
        </div>
      </m.div>

      {/* Bottom line */}
      <m.div
        className="w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent"
        style={{ height: 80 }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </div>
  );
};

const steps = [
  { label: 'Leyendo vectores semánticos…', icon: Brain },
  { label: 'Comparando trayectorias…', icon: Target },
  { label: 'Ponderando soft skills…', icon: Zap },
  { label: '✓ Veredicto listo', icon: Trophy },
];

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
const ComparatorSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Simulate live analysis steps
  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section
      id="comparator"
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden bg-slate-50 dark:bg-neutral-950 transition-colors duration-300 ease-in-out"
    >
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Left glow */}
        <div className="absolute left-0 top-1/3 size-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        {/* Right glow */}
        <div className="absolute right-0 top-1/3 size-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── HEADER ── */}
        <m.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <m.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-600 dark:text-white/50 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm transform-gpu transition-colors duration-300 ease-in-out shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <Swords size={11} />
            VeeBot Versus AI
          </m.div>

          <m.h2
            className="leading-[0.95] font-black tracking-tight text-neutral-900 dark:text-white mb-5 transition-colors duration-300 ease-in-out"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            <span>
              Compara.
            </span>
            <br />
            <span className="text-neutral-400 dark:text-white/20 transition-colors duration-300 ease-in-out">Decide.</span>
          </m.h2>

          <m.p
            className="text-neutral-600 dark:text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed transition-colors duration-300 ease-in-out"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Enfrenta dos candidatos en una batalla de datos. La IA analiza, pondera y elige al mejor fit para tu equipo - en segundos.
          </m.p>
        </m.div>

        {/* ── ARENA ── */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6">
          <CandidateCard candidate={CANDIDATE_A} delay={0.2} align="left" />
          <VsDivider />
          <CandidateCard candidate={CANDIDATE_B} delay={0.35} align="right" />
        </div>

        {/* ── AI ANALYSIS BAR ── */}
        <m.div
          className="mt-10 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-sm transform-gpu p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors duration-300 ease-in-out shadow-sm dark:shadow-none"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* Live indicator */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <m.div
              className="size-2 rounded-full bg-violet-500 dark:bg-violet-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-white/30 transition-colors duration-300 ease-in-out">IA Analizando</span>
          </div>

          {/* Steps */}
          <div className="flex-1 flex flex-wrap gap-2">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;
              const isDone = activeStep > i || (activeStep === 3 && i < 3);
              return (
                <AnimatePresence key={step.label} mode="popLayout">
                  <m.div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: isActive ? 'rgba(139,92,246,0.15)' : isDone ? 'rgba(139,92,246,0.04)' : 'transparent',
                      color: isActive ? '#a78bfa' : isDone ? '#8b5cf6' : '#9ca3af',
                      border: `1px solid ${isActive ? 'rgba(139,92,246,0.3)' : 'transparent'}`,
                    }}
                    animate={{ opacity: isActive || isDone ? 1 : 0.4 }}
                  >
                    <Icon size={11} />
                    {step.label}
                  </m.div>
                </AnimatePresence>
              );
            })}
          </div>

          {/* Winner badge */}
          <m.div
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(244,63,94,0.2))',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#c4b5fd',
            }}
            animate={{ boxShadow: ['0 0 0px rgba(139,92,246,0)', '0 0 20px rgba(139,92,246,0.3)', '0 0 0px rgba(139,92,246,0)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Trophy size={14} className="text-amber-400" />
            {CANDIDATE_A.name.split(' ')[0]} gana
          </m.div>
        </m.div>

        {/* ── CTA ── */}
        <m.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-neutral-500 dark:text-white/20 text-sm mb-4 transition-colors duration-300 ease-in-out">Disponible en el plan Premium</p>
          <m.a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #f43f5e)',
              boxShadow: '0 4px 30px rgba(139,92,246,0.35)',
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(139,92,246,0.5)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Swords size={15} />
            Probar Versus AI
            <ChevronRight size={15} />
          </m.a>
        </m.div>

      </div>
    </section>
  );
};

export default ComparatorSection;
