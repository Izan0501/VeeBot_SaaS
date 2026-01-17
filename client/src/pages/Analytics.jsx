import React, { useEffect, useState, useMemo } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Brush
} from 'recharts';
import {
    TrendingUp, Users, Target, Award, Download, ArrowUpRight, BrainCircuit, Activity, Zap, Sparkles, Fingerprint, Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// --- UTILIDAD DE NORMALIZACIÓN DE ROLES ---
const normalizeRole = (role) => {
    if (!role) return "Otros";
    const r = role.toLowerCase().trim();

    if (r.includes('full') && r.includes('stack')) return 'Full Stack Dev';
    if (r.includes('front') && r.includes('end')) return 'Frontend Dev';
    if (r.includes('back') && r.includes('end')) return 'Backend Dev';
    if (r.includes('data') && (r.includes('scien') || r.includes('anal'))) return 'Data Scientist';
    if (r.includes('mobile') || r.includes('android') || r.includes('ios')) return 'Mobile Dev';
    if (r.includes('devops') || r.includes('cloud')) return 'DevOps';
    if (r.includes('manager') || r.includes('lead') || r.includes('lider')) return 'Tech Lead / Manager';
    if (r.includes('qa') || r.includes('test')) return 'QA Engineer';

    return role.charAt(0).toUpperCase() + role.slice(1);
};

// --- UTILIDAD PARA PARSEAR FECHA (DD/MM HH:MM -> Date Object) ---
const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    try {
        const [datePart] = dateStr.split(' ');
        const [day, month] = datePart.split('/');
        const currentYear = new Date().getFullYear();
        return new Date(currentYear, parseInt(month) - 1, parseInt(day));
    } catch (e) {
        return new Date();
    }
};

const Analytics = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');
    const [userThreshold, setUserThreshold] = useState(70);

    // --- 1. FETCH DATOS Y CONFIGURACIÓN ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // 1. Traer Candidatos
                const resCandidates = await fetch('http://127.0.0.1:8000/candidates', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 2. Traer Configuración de Usuario
                const resUser = await fetch('http://127.0.0.1:8000/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (resCandidates.ok && resUser.ok) {
                    const dataCandidates = await resCandidates.json();
                    const dataUser = await resUser.json();

                    setCandidates(dataCandidates);
                    setUserThreshold(dataUser.min_score || 70);
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- 2. FILTRADO POR TIEMPO ---
    const filteredCandidates = useMemo(() => {
        if (timeRange === 'All') return candidates;

        const now = new Date();
        const daysToSubtract = timeRange === '7d' ? 7 : 30;
        const limitDate = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));

        return candidates.filter(c => {
            const cDate = parseDate(c.date);
            return cDate >= limitDate;
        });
    }, [candidates, timeRange]);

    // --- 3. PROCESAMIENTO DE ESTADÍSTICAS ---
    const stats = useMemo(() => {
        if (filteredCandidates.length === 0) return { avgScore: 0, topCandidates: 0, total: 0, efficiency: 0 };

        const total = filteredCandidates.length;
        const sumScore = filteredCandidates.reduce((acc, curr) => acc + (curr.score || 0), 0);
        const avgScore = Math.round(sumScore / total);
        const topCandidates = filteredCandidates.filter(c => c.score >= userThreshold).length;
        const efficiency = Math.min(99, Math.round((topCandidates / (total || 1)) * 100) + 30);

        return { total, avgScore, topCandidates, efficiency };
    }, [filteredCandidates, userThreshold]);

    // Datos para Gráfico de Barras
    const distributionData = useMemo(() => {
        const highLimit = userThreshold;
        const midLimit = userThreshold - 20;

        const ranges = [
            { name: `Bajo (<${midLimit})`, count: 0, color: '#EF4444' },
            { name: `Medio (${midLimit}-${highLimit - 1})`, count: 0, color: '#F59E0B' },
            { name: `Alto (${highLimit}+)`, count: 0, color: '#10B981' }
        ];

        filteredCandidates.forEach(c => {
            if (c.score >= highLimit) ranges[2].count++;
            else if (c.score >= midLimit) ranges[1].count++;
            else ranges[0].count++;
        });
        return ranges;
    }, [filteredCandidates, userThreshold]);

    // Datos para Gráfico Circular
    const roleData = useMemo(() => {
        const roles = {};
        filteredCandidates.forEach(c => {
            const normalized = normalizeRole(c.role);
            roles[normalized] = (roles[normalized] || 0) + 1;
        });

        return Object.entries(roles)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [filteredCandidates]);

    // --- DATOS COMPLETOS PARA TREND CHART (Ordenados cronológicamente) ---
    const trendData = useMemo(() => {
        // Ordenar por fecha real para que el gráfico fluya de izquierda a derecha correctamente
        const sorted = [...filteredCandidates].sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateA - dateB;
        });

        return sorted.map((c) => ({
            day: c.name.split(' ')[0], // Nombre corto
            score: c.score,
            fullDate: c.date
        }));
    }, [filteredCandidates]);

    // --- DATOS SKILLS ---
    const topSkillsData = useMemo(() => {
        const skillCounts = {};
        filteredCandidates.forEach(c => {
            if (c.skills && Array.isArray(c.skills)) {
                c.skills.forEach(skill => {
                    const s = skill.trim();
                    if (s) skillCounts[s] = (skillCounts[s] || 0) + 1;
                });
            }
        });
        return Object.entries(skillCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [filteredCandidates]);

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

    // --- FUNCIÓN DE EXPORTACIÓN ---
    const handleExportReport = () => {
        if (filteredCandidates.length === 0) return toast.error("No hay datos para exportar.");

        const separator = ";";
        const headers = ["ID", "Nombre", "Rol Detectado", "Score", "Estado", "Fecha", "Skills"];
        const csvHeader = headers.join(separator) + "\n";

        const csvRows = filteredCandidates.map(c => {
            const cleanName = c.name ? c.name.replace(/;/g, ",") : "";
            const cleanRole = c.role ? c.role.replace(/;/g, ",") : "";
            const cleanSkills = c.skills ? c.skills.join(" | ") : "";
            const cleanDate = c.date ? `"${c.date}"` : "";

            return [
                c.id, cleanName, cleanRole, c.score, c.status, cleanDate, cleanSkills
            ].join(separator);
        });

        const csvContent = csvHeader + csvRows.join("\n");
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `veebot_reporte_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Reporte descargado (Excel Friendly) 📊");
    };

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
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    {range === 'All' ? 'Histórico' : range.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleExportReport}
                            className="flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 group"
                        >
                            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                            <span>Exportar Vista</span>
                        </button>
                    </div>
                </motion.div>

                {/* --- GRID DE KPIS (CARDS) --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <KPICard
                        title="Candidatos (Vista)"
                        value={stats.total}
                        icon={<Users size={24} className="text-white" />}
                        color="from-blue-500 to-indigo-600"
                        delay={0}
                        trend={timeRange === 'All' ? 'Histórico' : `Últimos ${timeRange}`}
                    />
                    <KPICard
                        title="Calidad Promedio"
                        value={`${stats.avgScore}%`}
                        icon={<Target size={24} className="text-white" />}
                        color="from-violet-500 to-purple-600"
                        delay={0.1}
                        trend={stats.avgScore > userThreshold ? "Alta" : "Media"}
                    />
                    <KPICard
                        title="Talentos Top"
                        value={stats.topCandidates}
                        icon={<Award size={24} className="text-white" />}
                        color="from-emerald-400 to-green-600"
                        delay={0.2}
                        trend={`Match > ${userThreshold}`}
                    />
                    <KPICard
                        title="Eficiencia IA"
                        value={`${stats.efficiency}%`}
                        icon={<Zap size={24} className="text-white" />}
                        color="from-amber-400 to-orange-600"
                        delay={0.3}
                        trend="Ahorro tiempo"
                    />
                </div>

                {/* --- SECCIÓN NUEVA: AI EXECUTIVE SUMMARY (CON BOTÓN FUNCIONAL) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                    className="mb-10 bg-gradient-to-r from-indigo-900 to-violet-900 rounded-3xl p-1 shadow-xl shadow-indigo-900/20"
                >
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-white/10">
                        <div className="p-4 bg-white/10 rounded-full relative">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                            <BrainCircuit size={32} className="text-indigo-300 relative z-10" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                                <Sparkles size={16} className="text-yellow-400" /> Executive AI Summary
                            </h3>
                            <p className="text-indigo-100/80 text-sm leading-relaxed max-w-2xl">
                                {stats.total > 0
                                    ? `Analizando ${stats.total} perfiles. La calidad promedio es del ${stats.avgScore}%. Se han detectado ${stats.topCandidates} candidatos de alto impacto listos para entrevista. El rol predominante es ${roleData[0]?.name || 'N/A'}.`
                                    : "Esperando datos para generar insights inteligentes. Sube CVs para comenzar."}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            {/* BOTÓN AHORA FUNCIONAL */}
                            <button
                                onClick={handleExportReport}
                                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-colors border border-white/10 flex items-center gap-2"
                            >
                                <Download size={14} /> Ver Reporte Completo
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* --- SECCIÓN DE GRÁFICOS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

                    {/* 1. GRÁFICO PRINCIPAL (AREAS) MEJORADO CON BRUSH STYLING */}
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
                                <p className="text-xs text-slate-500 mt-1">Evolución del puntaje de candidatos en este periodo.</p>
                            </div>
                        </div>
                        <div className="h-80 w-full">
                            {stats.total > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
                                        <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />

                                        {/* --- MEJORA: BRUSH ESTILIZADO Y LIMPIO --- */}
                                        <Brush
                                            dataKey="day"
                                            height={20}
                                            stroke="#818cf8"
                                            fill="transparent"
                                            tickFormatter={() => ""}
                                            alwaysShowText={false}
                                            travellerWidth={10}
                                            startIndex={Math.max(0, trendData.length - 15)} // Zoom inicial en los ultimos 15
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">Sin datos en este rango.</div>
                            )}
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
                            {stats.total > 0 ? (
                                <>
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
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total</span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">Sin datos.</div>
                            )}
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

                {/* --- 3. SECCIÓN INFERIOR: CALIDAD + SKILLS (GRID 2 COLUMNAS) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    {/* BARRAS DE DISTRIBUCIÓN */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Lightbulb size={20} className="text-amber-500" /> Calidad del Pipeline
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Clasificación basada en tu umbral de <strong>{userThreshold}%</strong>.
                                </p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                                {stats.topCandidates} Top
                            </div>
                        </div>

                        <div className="h-64 w-full">
                            {stats.total > 0 ? (
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
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">Sin datos para graficar.</div>
                            )}
                        </div>
                    </motion.div>

                    {/* --- TOP SKILLS DEMAND --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Fingerprint size={20} className="text-cyan-500" /> Habilidades Top
                                </h3>
                                <p className="text-sm text-slate-500">Tecnologías más demandadas en tu base.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {topSkillsData.length > 0 ? topSkillsData.map((item, index) => (
                                <div key={index} className="group">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                                        <span className="text-slate-400 text-xs">{item.count}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.count / (stats.total || 1)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                            className={`h-full rounded-full bg-gradient-to-r ${index === 0 ? 'from-cyan-500 to-blue-500' : index === 1 ? 'from-blue-500 to-indigo-500' : 'from-indigo-400 to-violet-400'}`}
                                        />
                                    </div>
                                </div>
                            )) : <div className="h-40 flex items-center justify-center text-slate-400 italic">Insuficientes datos de skills.</div>}
                        </div>
                    </motion.div>

                </div>

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
            </div>
        </div>
    </motion.div>
);

export default Analytics;