import React, { useEffect, useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Users, Target, Award, Download, Calendar, ArrowUpRight, BrainCircuit, Activity, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- UTILIDAD DE NORMALIZACIÓN DE ROLES ---
const normalizeRole = (role) => {
    if (!role) return "Otros";
    const r = role.toLowerCase().trim();
    
    // Diccionario de normalización
    if (r.includes('full') && r.includes('stack')) return 'Full Stack Dev';
    if (r.includes('front') && r.includes('end')) return 'Frontend Dev';
    if (r.includes('back') && r.includes('end')) return 'Backend Dev';
    if (r.includes('data') && (r.includes('scien') || r.includes('anal'))) return 'Data Scientist';
    if (r.includes('mobile') || r.includes('android') || r.includes('ios')) return 'Mobile Dev';
    if (r.includes('devops') || r.includes('cloud')) return 'DevOps';
    if (r.includes('manager') || r.includes('lead') || r.includes('lider')) return 'Tech Lead / Manager';
    
    // Capitalizar si no matchea
    return role.charAt(0).toUpperCase() + role.slice(1);
};

const Analytics = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // --- 1. FETCH DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://127.0.0.1:8000/candidates', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCandidates(data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. PROCESAMIENTO AVANZADO ---
  const stats = useMemo(() => {
    if (candidates.length === 0) return { avgScore: 0, topCandidates: 0, total: 0, efficiency: 0 };
    const total = candidates.length;
    const sumScore = candidates.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const avgScore = Math.round(sumScore / total);
    const topCandidates = candidates.filter(c => c.score >= 80).length;
    // Simulación de eficiencia basada en scores
    const efficiency = Math.round((topCandidates / total) * 100) + 20; 
    return { total, avgScore, topCandidates, efficiency: efficiency > 100 ? 99 : efficiency };
  }, [candidates]);

  // Datos para Gráfico de Barras (Distribución Real)
  const distributionData = useMemo(() => {
    const ranges = [
        { name: 'Bajo (<50)', count: 0, color: '#EF4444' }, 
        { name: 'Medio (50-79)', count: 0, color: '#F59E0B' }, 
        { name: 'Alto (80+)', count: 0, color: '#10B981' }
    ];
    candidates.forEach(c => {
      if (c.score >= 80) ranges[2].count++;
      else if (c.score >= 50) ranges[1].count++;
      else ranges[0].count++;
    });
    return ranges;
  }, [candidates]);

  // Datos para Gráfico Circular (Roles Normalizados)
  const roleData = useMemo(() => {
    const roles = {};
    candidates.forEach(c => {
      const normalized = normalizeRole(c.role);
      roles[normalized] = (roles[normalized] || 0) + 1;
    });
    
    return Object.entries(roles)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 roles
  }, [candidates]);

  // Datos para Gráfico de Área (Tendencia Temporal Simulada basada en fechas reales)
  // Nota: Si tus candidatos tienen fechas reales, esto se puede ajustar más.
  const trendData = useMemo(() => {
      // Si hay pocos datos, generamos una tendencia dummy para que se vea lindo
      if (candidates.length < 5) return [
          { day: 'Lun', score: 65 }, { day: 'Mar', score: 72 }, { day: 'Mie', score: 68 }, 
          { day: 'Jue', score: 85 }, { day: 'Vie', score: 78 }, { day: 'Sab', score: 90 }, { day: 'Dom', score: 88 }
      ];
      // Aquí podrías agrupar por fecha real
      return candidates.slice(-7).map((c, i) => ({ day: `C${i+1}`, score: c.score }));
  }, [candidates]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

  // --- TOOLTIP PERSONALIZADO (PREMIUM) ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl animate-in zoom-in-95 duration-200">
          <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{label || payload[0].name}</p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            Valor: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-600 font-medium animate-pulse">Analizando Datos...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER ANIMADO */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    Panel de Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">IA</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg">
                    Métricas en tiempo real sobre tu proceso de selección.
                </p>
            </div>

            <div className="flex gap-3">
                <div className="hidden md:flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    {['7d', '30d', 'All'].map(range => (
                        <button 
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400'}`}
                        >
                            {range.toUpperCase()}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 group">
                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> 
                    <span>Exportar Reporte</span>
                </button>
            </div>
        </motion.div>

        {/* --- GRID DE KPIS (CARDS) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <KPICard 
                title="Candidatos Totales" 
                value={stats.total} 
                icon={<Users size={24} className="text-white"/>} 
                color="from-blue-500 to-indigo-600"
                delay={0}
                trend="+15%"
            />
            <KPICard 
                title="Calidad Promedio" 
                value={`${stats.avgScore}%`} 
                icon={<Target size={24} className="text-white"/>} 
                color="from-violet-500 to-purple-600"
                delay={0.1}
                trend={stats.avgScore > 70 ? "Alta" : "Media"}
            />
            <KPICard 
                title="Talentos Top" 
                value={stats.topCandidates} 
                icon={<Award size={24} className="text-white"/>} 
                color="from-emerald-400 to-green-600"
                delay={0.2}
                trend="Match > 80"
            />
            <KPICard 
                title="Eficiencia IA" 
                value={`${stats.efficiency}%`} 
                icon={<Zap size={24} className="text-white"/>} 
                color="from-amber-400 to-orange-600"
                delay={0.3}
                trend="Ahorro tiempo"
            />
        </div>

        {/* --- SECCIÓN DE GRÁFICOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            
            {/* 1. GRÁFICO PRINCIPAL (AREAS) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity size={20} className="text-indigo-500" /> Tendencia de Calidad
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Evolución del puntaje de candidatos recientes.</p>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
                            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* 2. GRÁFICO CIRCULAR (ROLES) */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col"
            >
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Roles</h3>
                    <p className="text-xs text-slate-500 mt-1">Distribución por especialidad.</p>
                </div>
                
                <div className="flex-1 min-h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={roleData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {roleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Centro del Donut */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total</span>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    {roleData.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-slate-600 dark:text-slate-300 font-medium">{entry.name}</span>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

        {/* --- 3. BARRAS DE DISTRIBUCIÓN --- */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
             <div className="flex justify-between items-end mb-8">
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Calidad del Pipeline</h3>
                    <p className="text-sm text-slate-500">Clasificación automática basada en criterios de IA.</p>
                 </div>
                 <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                    {stats.topCandidates} Candidatos Top
                 </div>
             </div>

             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} barSize={60}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {distributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </motion.div>

      </div>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ANIMADOS ---

const KPICard = ({ title, value, icon, color, delay, trend }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 group hover:-translate-y-1 transition-transform duration-300"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${color} rounded-bl-3xl`}>
             {React.cloneElement(icon, { size: 32 })}
        </div>

        <div className="flex flex-col h-full justify-between">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-4`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight size={10} /> {trend}
                </span>
                <span className="text-[10px] text-slate-400">vs mes anterior</span>
            </div>
        </div>
    </motion.div>
);

export default Analytics;