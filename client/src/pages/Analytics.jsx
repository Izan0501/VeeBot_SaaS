/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React, { useEffect, useState, useMemo } from 'react';
import { Users, Target, Award, Zap } from 'lucide-react';

// --- IMPORTS DE UTILIDADES ---
import { normalizeRole, parseDate } from '../utils/analyticsUtils';

// --- IMPORTS API (Lo que faltaba) ---
import { candidatesAPI } from '../api/candidates';
import { authAPI } from '../api/auth';

// --- IMPORTS DE COMPONENTES ---
import AnalyticsHeader from '../components/analytics/AnalyticsHeader';
import KPICard from '../components/analytics/KPICard';
import ExecutiveSummary from '../components/analytics/ExecutiveSummary';
import TrendChart from '../components/analytics/TrendChart';
import RolesPieChart from '../components/analytics/RolesPieChart';
import QualityBarChart from '../components/analytics/QualityBarChart';
import SkillsList from '../components/analytics/SkillsList';

const Analytics = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');
    const [userThreshold, setUserThreshold] = useState(70);

    // --- 1. FETCH DATOS (Ahora usando la capa API) ---
    // eslint-disable-next-line react-doctor/no-initialize-state
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ejecutamos ambas peticiones en paralelo para mayor velocidad
                const [dataCandidates, dataUser] = await Promise.all([
                    candidatesAPI.getAll(),
                    authAPI.getMe()
                ]);

                if (Array.isArray(dataCandidates)) {
                    setCandidates(dataCandidates);
                }

                // Obtenemos la configuración de umbral del usuario
                setUserThreshold(dataUser.min_score || 70);

            } catch (error) {
                console.error("Error fetching analytics data:", error);
                // Aquí podrías mostrar un toast o un estado de error visual
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- 2. FILTRADO POR TIEMPO (Lógica de Negocio) ---
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

    // --- 3. CÁLCULO DE ESTADÍSTICAS ---
    const stats = useMemo(() => {
        if (filteredCandidates.length === 0) return { avgScore: 0, topCandidates: 0, total: 0, efficiency: 0 };

        const total = filteredCandidates.length;
        const sumScore = filteredCandidates.reduce((acc, curr) => acc + (curr.score || 0), 0);
        const avgScore = Math.round(sumScore / total);
        const topCandidates = filteredCandidates.filter(c => c.score >= userThreshold).length;
        // Eficiencia simulada basada en ratio de éxito
        const efficiency = Math.min(99, Math.round((topCandidates / (total || 1)) * 100) + 30);

        return { total, avgScore, topCandidates, efficiency };
    }, [filteredCandidates, userThreshold]);

    // Preparación de datos para gráficos (Bar Chart)
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

    // Preparación de datos para gráficos (Pie Chart)
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

    // Preparación de datos para gráficos (Area Chart)
    const trendData = useMemo(() => {
        const sorted = filteredCandidates.toSorted((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateA - dateB;
        });
        return sorted.map((c) => ({
            day: c.name.split(' ')[0], // Usamos el primer nombre como etiqueta temporal si no hay fecha exacta
            score: c.score,
            fullDate: c.date
        }));
    }, [filteredCandidates]);

    // Preparación de datos para Skills
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

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <div className="size-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-indigo-600 font-medium animate-pulse">Analizando Datos…</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                <AnalyticsHeader timeRange={timeRange} setTimeRange={setTimeRange} />

                {/* --- GRID DE KPIS --- */}
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

                <ExecutiveSummary stats={stats} roleData={roleData} />

                {/* --- GRÁFICOS PRINCIPALES --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <TrendChart trendData={trendData} hasData={stats.total > 0} />
                    <RolesPieChart roleData={roleData} total={stats.total} hasData={stats.total > 0} />
                </div>

                {/* --- SECCIÓN INFERIOR --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <QualityBarChart
                        distributionData={distributionData}
                        topCandidates={stats.topCandidates}
                        threshold={userThreshold}
                        hasData={stats.total > 0}
                    />
                    <SkillsList topSkillsData={topSkillsData} total={stats.total} />
                </div>

            </div>
        </div>
    );
};

export default Analytics;