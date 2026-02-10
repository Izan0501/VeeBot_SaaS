import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const VerdictCard = ({ verdict, winnerName }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 text-center">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <Trophy className="text-yellow-400 fill-yellow-400" /> Veredicto de la IA
            </h3>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl mx-auto font-medium">
                "{verdict}"
            </p>
            <div className="mt-6 inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-sm font-bold tracking-wide">
                Ganador Sugerido: {winnerName}
            </div>
        </div>
    </motion.div>
);

export default VerdictCard;