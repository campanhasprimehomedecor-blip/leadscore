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
import { Flame, Zap, Snowflake, Clock } from 'lucide-react';

interface LeadRadarChartProps {
  result: LeadScoreResult;
}

export const LeadRadarChart: React.FC<LeadRadarChartProps> = ({ result }) => {
  const radarData = result.categoryResults.map((cat) => {
    let name = '';
    let value = 0;

    if (cat.id === 'perfil') name = 'Perfil';
    else if (cat.id === 'intencao') name = 'Intenção';
    else if (cat.id === 'origem') name = 'Origem';
    else if (cat.id === 'urgencia') name = 'Urgência';
    else if (cat.id === 'penalizacoes') {
      name = 'Saúde';
      const penaltyPct = (cat.cappedPoints / cat.maxPoints) * 100;
      value = Math.max(0, 100 - penaltyPct);
    }

    if (cat.id !== 'penalizacoes') {
      value = Math.round((cat.cappedPoints / cat.maxPoints) * 100);
    }

    return {
      subject: name,
      valor: value,
      pontos: cat.cappedPoints,
      max: cat.maxPoints,
      isPenalty: cat.isPenalty,
    };
  });

  const getHeatTheme = (classification: string) => {
    switch (classification) {
      case 'Lead Quente':
        return {
          radarColor: '#ef4444',
          badgeBg: 'bg-red-500/15 text-red-600 border-red-200',
          icon: <Flame className="w-5 h-5 text-red-500 fill-red-500" />,
        };
      case 'Lead Morno':
        return {
          radarColor: '#f59e0b',
          badgeBg: 'bg-amber-500/15 text-amber-700 border-amber-200',
          icon: <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />,
        };
      case 'Lead Frio':
        return {
          radarColor: '#0284c7',
          badgeBg: 'bg-sky-500/15 text-sky-700 border-sky-200',
          icon: <Snowflake className="w-5 h-5 text-sky-500" />,
        };
      default:
        return {
          radarColor: '#64748b',
          badgeBg: 'bg-slate-500/15 text-slate-700 border-slate-200',
          icon: <Clock className="w-5 h-5 text-slate-400" />,
        };
    }
  };

  const theme = getHeatTheme(result.classification);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
      {/* Sleek Score & Temperature Header */}
      <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-white shadow-2xs border border-slate-200">
            {theme.icon}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Qualificação
            </div>
            <div className="text-base font-black text-slate-900">
              {result.classification}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-amber-600 leading-none">
            {result.totalScore}
            <span className="text-xs font-bold text-slate-400">/100</span>
          </div>
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">
            Score Total
          </div>
        </div>
      </div>

      {/* Radar Canvas */}
      <div className="w-full h-[220px] bg-slate-900 rounded-xl p-2 relative shadow-inner border border-slate-800">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
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
                    <div className="bg-slate-950 border border-slate-700 p-2 rounded-lg text-white text-xs shadow-xl">
                      <p className="font-bold text-amber-400">{data.subject}</p>
                      <p className="text-slate-300">{data.valor}% de aproveitamento</p>
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
              fill={theme.radarColor}
              fillOpacity={0.45}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Bars */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
        {result.categoryResults.map((cat) => (
          <div key={cat.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <span className="text-slate-600 truncate">{cat.title.split('(')[0]}</span>
            <span className={cat.isPenalty ? 'text-red-600 font-bold' : 'text-slate-900 font-bold'}>
              {cat.isPenalty ? `-${cat.cappedPoints}` : `${cat.cappedPoints}/${cat.maxPoints}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
