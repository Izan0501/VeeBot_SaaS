import React from 'react';
import { m } from 'framer-motion';
import { User, BarChart3, Activity, Filter } from 'lucide-react';
import StatCard from '../common/StatCard';

const StatsGrid = ({ variants, candidates, avgScore, lowMatchCount }) => (
    <m.div variants={variants.container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <m.div variants={variants.item}>
            <StatCard title="Total Candidatos" value={candidates.length} trend="Base Activa" icon={<User className="text-white" size={20} />} color="bg-indigo-500" />
        </m.div>
        <m.div variants={variants.item}>
            <StatCard title="Top Talents" value={candidates.filter(c => c.score > 80).length} trend="Match > 80%" icon={<BarChart3 className="text-white" size={20} />} color="bg-emerald-500" />
        </m.div>
        <m.div variants={variants.item}>
            <StatCard title="Calidad Global" value={`${avgScore}%`} trend="Score Promedio" icon={<Activity className="text-white" size={20} />} color="bg-violet-500" />
        </m.div>
        <m.div variants={variants.item}>
            <StatCard title="Bajo Ajuste" value={lowMatchCount} trend="Score < 50%" icon={<Filter className="text-white" size={20} />} color="bg-rose-500" />
        </m.div>
    </m.div>
);

export default StatsGrid;