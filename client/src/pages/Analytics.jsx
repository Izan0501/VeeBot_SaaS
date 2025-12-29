import React, { useEffect, useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Users, Target, Award, Download, Calendar, ArrowUpRight, BrainCircuit
} from 'lucide-react';

const Analytics = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
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

  // --- 2. PROCESAMIENTO ---
  const stats = useMemo(() => {
    if (candidates.length === 0) return { avgScore: 0, topCandidates: 0, total: 0 };
    const total = candidates.length;
    const sumScore = candidates.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const avgScore = Math.round(sumScore / total);
    const topCandidates = candidates.filter(c => c.score >= 80).length;
    return { total, avgScore, topCandidates };
  }, [candidates]);

  const distributionData = useMemo(() => {
    const ranges = [{ name: 'Bajo', count: 0 }, { name: 'Medio', count: 0 }, { name: 'Alto', count: 0 }];
    candidates.forEach(c => {
      if (c.score >= 80) ranges[2].count++;
      else if (c.score >= 50) ranges[1].count++;
      else ranges[0].count++;
    });
    return ranges;
  }, [candidates]);

  const roleData = useMemo(() => {
    const roles = {};
    candidates.forEach(c => {
      const role = c.role || "Otros";
      const shortRole = role.length > 15 ? role.substring(0, 12) + '...' : role;
      roles[shortRole] = (roles[shortRole] || 0) + 1;
    });
    return Object.entries(roles)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [candidates]);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  // Tooltip personalizado para que se adapte al Dark Mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
          <p className="text-sm font-bold text-slate-800 dark:text-white">{label}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 gap-2">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div> Cargando datos...
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 md:p-8 overflow-y-auto pb-20 custom-scrollbar transition-colors duration-300">

      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Reporte de Reclutamiento</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Visión general del rendimiento y calidad.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full sm:w-auto transition-colors">
            <Calendar size={16} /> <span className="sm:hidden md:inline">Últimos</span> 30 días
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-200 dark:shadow-none w-full sm:w-auto active:scale-95 transition-all">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <KPICard
          title="Candidatos"
          value={stats.total}
          icon={<Users className="text-blue-600 dark:text-blue-400" size={20} />}
          bg="bg-blue-50 dark:bg-blue-900/20"
          trend="+12% vs mes"
        />
        <KPICard
          title="Score Promedio"
          value={`${stats.avgScore}%`}
          icon={<Target className="text-indigo-600 dark:text-indigo-400" size={20} />}
          bg="bg-indigo-50 dark:bg-indigo-900/20"
          trend={stats.avgScore > 70 ? "Alta Calidad" : "Media"}
        />
        <KPICard
          title="Top Talentos"
          value={stats.topCandidates}
          icon={<Award className="text-green-600 dark:text-green-400" size={20} />}
          bg="bg-green-50 dark:bg-green-900/20"
          trend={`${Math.round((stats.topCandidates / stats.total) * 100 || 0)}% conversion`}
        />
        <KPICard
          title="Velocidad IA"
          value="0.8s"
          icon={<BrainCircuit className="text-purple-600 dark:text-purple-400" size={20} />}
          bg="bg-purple-50 dark:bg-purple-900/20"
          trend="Por CV"
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">

        {/* 1. Barras */}
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="mb-6">
            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white">Distribución de Score</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Clasificación automática por IA.</p>
          </div>
          <div className="h-64 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                {/* Grid ajustado para que se vea sutil en ambos modos */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Circular */}
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="mb-6">
            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white">Top Roles</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Perfiles más frecuentes detectados.</p>
          </div>
          <div className="h-64 md:h-72 w-full flex flex-col items-center justify-center">
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none" // Quita el borde blanco por defecto de Recharts
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 italic text-sm">Sin datos suficientes.</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {roleData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI INSIGHTS */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-5 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 pointer-events-none">
          <BrainCircuit size={100} className="md:w-32 md:h-32" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="text-green-400" size={20} /> VeeBot Insights
          </h3>
          <p className="text-indigo-200 mb-6 text-sm md:text-base max-w-2xl leading-relaxed">
            Análisis de {stats.total} perfiles: Rendimiento {stats.avgScore > 70 ? "sólido" : "moderado"}.
            Se recomienda priorizar entrevistas técnicas esta semana.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InsightBox title="Mejor Perfil" value={candidates.sort((a, b) => b.score - a.score)[0]?.name || "N/A"} />
            <InsightBox title="Acción" value="Contactar Top 3" />
            <InsightBox title="Eficiencia" value="95% Ahorro" color="text-green-400" />
          </div>
        </div>
      </div>

    </div>
  );
};

// --- SUBCOMPONENTES ADAPTADOS A DARK MODE ---

const KPICard = ({ title, value, icon, bg, trend }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl ${bg}`}>{icon}</div>
      <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-900/50 whitespace-nowrap">
        <ArrowUpRight size={10} />
        <span>{trend}</span>
      </div>
    </div>
    <div>
      <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight truncate" title={value}>{value}</h3>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">{title}</p>
    </div>
  </div>
);

const InsightBox = ({ title, value, color = "text-white" }) => (
  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
    <p className="text-[10px] text-indigo-300 uppercase font-bold mb-1 tracking-wider">{title}</p>
    <p className={`font-semibold text-base md:text-lg truncate ${color}`}>{value}</p>
  </div>
);

export default Analytics;