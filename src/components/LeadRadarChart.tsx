import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { LeadScoreResult } from '../types';
import { Flame, Zap, Snowflake, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LeadRadarChartProps {
  result: LeadScoreResult;
}

export const LeadRadarChart: React.FC<LeadRadarChartProps> = ({ result }) => {
  // Format data for Radar Chart (0 to 100 percentage per dimension)
  const radarData = result.categoryResults.map((cat) => {
    let name = '';
    let value = 0;

    if (cat.id === 'perfil') name = 'Perfil';
    else if (cat.id === 'intencao') name = 'Intenção';
    else if (cat.id === 'origem') name = 'Origem';
    else if (cat.id === 'urgencia') name = 'Urgência';
    else if (cat.id === 'penalizacoes') {
      name = 'Saúde Lead';
      // Invert penalty so higher percentage means healthier lead (fewer penalties)
      const penaltyPct = (cat.cappedPoints / cat.maxPoints) * 100;
      value = Math.max(0, 100 - penaltyPct);
    }

    if (cat.id !== 'penalizacoes') {
      value = Math.round((cat.cappedPoints / cat.maxPoints) * 100);
    }

    return {
      subject: name,
      valor: value,
      fullMark: 100,
      pontos: cat.cappedPoints,
      max: cat.maxPoints,
      isPenalty: cat.isPenalty,
    };
  });

  // Color theme based on heat classification
  const getHeatTheme = (classification: string) => {
    switch (classification) {
      case 'Lead Quente':
        return {
          badgeBg: 'bg-red-500/15 border-red-500/30 text-red-600',
          radarColor: '#ef4444', // red-500
          radarFill: '#ef4444',
          glow: 'shadow-red-500/20',
          gradientFrom: 'from-red-500',
          gradientTo: 'to-amber-500',
          icon: <Flame className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />,
          label: 'MUITO ALTA TEMPERATURA',
          bgCard: 'bg-gradient-to-br from-red-50/80 to-amber-50/50 border-red-200',
        };
      case 'Lead Morno':
        return {
          badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-700',
          radarColor: '#f59e0b', // amber-500
          radarFill: '#f59e0b',
          glow: 'shadow-amber-500/20',
          gradientFrom: 'from-amber-500',
          gradientTo: 'to-orange-500',
          icon: <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />,
          label: 'MÉDIA TEMPERATURA',
          bgCard: 'bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-amber-200',
        };
      case 'Lead Frio':
        return {
          badgeBg: 'bg-sky-500/15 border-sky-500/30 text-sky-700',
          radarColor: '#0284c7', // sky-600
          radarFill: '#38bdf8',
          glow: 'shadow-sky-500/20',
          gradientFrom: 'from-sky-500',
          gradientTo: 'to-blue-600',
          icon: <Snowflake className="w-6 h-6 text-sky-500" />,
          label: 'BAIXA TEMPERATURA',
          bgCard: 'bg-gradient-to-br from-sky-50/80 to-slate-50/50 border-sky-200',
        };
      default:
        return {
          badgeBg: 'bg-slate-500/15 border-slate-500/30 text-slate-700',
          radarColor: '#64748b', // slate-500
          radarFill: '#94a3b8',
          glow: 'shadow-slate-500/10',
          gradientFrom: 'from-slate-400',
          gradientTo: 'to-slate-600',
          icon: <Clock className="w-6 h-6 text-slate-400" />,
          label: 'SEM TEMPERATURA',
          bgCard: 'bg-slate-50 border-slate-200',
        };
    }
  };

  const theme = getHeatTheme(result.classification);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 space-y-5 sticky top-4">
      {/* Heat Meter Header */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${theme.bgCard}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              {theme.label}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            {result.classification}
          </div>
          <p className="text-xs font-semibold text-slate-700">
            {result.recommendation}
          </p>
        </div>

        {/* Score Flame Circle */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white shadow-lg border-2 border-amber-400">
            <span className="text-2xl font-black text-amber-400">{result.totalScore}</span>
            <span className="text-[10px] text-slate-400 font-bold absolute bottom-1">/100</span>
          </div>
        </div>
      </div>

      {/* Radar Chart Title & Heat Radar Canvas */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Radar de Calor de Qualificação
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">
            Equilíbrio de Perfil
          </span>
        </div>

        {/* Radar Graphic Container */}
        <div className="w-full h-[250px] sm:h-[280px] bg-slate-900 rounded-xl p-2 relative overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center">
          {/* Subtle background radar grid glow effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-950 pointer-events-none" />

          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-slate-700 p-2.5 rounded-lg text-white text-xs shadow-xl backdrop-blur-md">
                        <p className="font-bold text-amber-400">{data.subject}</p>
                        <p className="text-slate-200 mt-0.5">
                          Desempenho: <span className="font-bold text-white">{data.valor}%</span>
                        </p>
                        {data.isPenalty ? (
                          <p className="text-red-400 text-[10px]">
                            Penalizações: -{data.pontos} pts
                          </p>
                        ) : (
                          <p className="text-slate-400 text-[10px]">
                            {data.pontos} de {data.max} pontos
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Radar
                name="Score Lead"
                dataKey="valor"
                stroke={theme.radarColor}
                fill={theme.radarFill}
                fillOpacity={0.45}
                strokeWidth={2.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categories Heat Breakdown List */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
          Termômetro das Categorias
        </h4>

        <div className="space-y-2 text-xs">
          {result.categoryResults.map((cat) => {
            const pct = cat.isPenalty
              ? Math.min(100, Math.round((cat.cappedPoints / cat.maxPoints) * 100))
              : Math.min(100, Math.round((cat.cappedPoints / cat.maxPoints) * 100));

            return (
              <div key={cat.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-slate-800 font-semibold">
                  <span className="truncate max-w-[170px]">{cat.title.split('(')[0]}</span>
                  {cat.isPenalty ? (
                    <span className="text-red-700 font-bold">-{cat.cappedPoints} pts</span>
                  ) : (
                    <span className="text-slate-900 font-bold">
                      {cat.cappedPoints}/{cat.maxPoints} pts
                    </span>
                  )}
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      cat.isPenalty
                        ? cat.cappedPoints > 0
                          ? 'bg-red-500'
                          : 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
