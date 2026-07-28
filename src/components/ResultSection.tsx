import React, { useState } from 'react';
import { LeadScoreResult } from '../types';
import { generateCopyText } from '../utils/calculator';
import { Flame, Zap, Snowflake, Clock, Copy, Check, RefreshCw, RotateCcw } from 'lucide-react';

interface ResultSectionProps {
  result: LeadScoreResult;
  leadName: string;
  onClear: () => void;
  onNewEvaluation: () => void;
  onCalculateScroll: () => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  leadName,
  onClear,
  onNewEvaluation,
  onCalculateScroll,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = generateCopyText(result, leadName);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const getBadgeStyle = (classification: string) => {
    switch (classification) {
      case 'Lead Quente':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-600',
          icon: <Flame className="w-5 h-5 text-red-500 fill-red-500" />,
          barColor: 'bg-red-500',
        };
      case 'Lead Morno':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
          icon: <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />,
          barColor: 'bg-amber-500',
        };
      case 'Lead Frio':
        return {
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-600',
          icon: <Snowflake className="w-5 h-5 text-sky-500" />,
          barColor: 'bg-sky-500',
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-600',
          icon: <Clock className="w-5 h-5 text-slate-500" />,
          barColor: 'bg-slate-400',
        };
    }
  };

  const badge = getBadgeStyle(result.classification);

  return (
    <div id="resultado-section" className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Relatório do Lead
          </h2>
          {leadName && (
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Nome do Lead: <span className="text-slate-900 font-bold">{leadName}</span>
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onCalculateScroll}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalcular</span>
          </button>

          <button
            onClick={onClear}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>

          <button
            onClick={handleCopy}
            type="button"
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs border ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar para WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Card */}
        <div className="bg-slate-900 text-white rounded-xl p-5 text-center flex flex-col items-center justify-center shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Score Geral
          </span>
          <div className="text-4xl sm:text-5xl font-black text-amber-400 my-1">
            {result.totalScore}
            <span className="text-lg text-slate-400 font-normal"> / 100</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${badge.barColor}`}
              style={{ width: `${Math.min(100, Math.max(0, result.totalScore))}%` }}
            />
          </div>
        </div>

        {/* Classification */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-center items-start">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
            Classificação
          </span>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-base font-extrabold mb-1.5 ${badge.bg}`}>
            {badge.icon}
            <span>{result.classification}</span>
          </div>
          <p className="text-xs text-slate-500">
            Nível de prontidão comercial calculado automaticamente.
          </p>
        </div>

        {/* Recommendation */}
        <div className="bg-amber-50/70 rounded-xl p-5 border border-amber-200 flex flex-col justify-center items-start">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 mb-1.5">
            Recomendação SDR
          </span>
          <p className="text-sm font-bold text-amber-950 leading-tight">
            {result.recommendation}
          </p>
          <span className="text-[11px] text-amber-700 mt-1">
            Próximo passo comercial sugerido.
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Pontuação por Categoria
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {result.categoryResults.map((cat) => (
            <div
              key={cat.id}
              className={`p-3 rounded-lg border text-xs ${
                cat.isPenalty
                  ? 'bg-red-50/40 border-red-200 text-red-950'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="font-semibold text-slate-600 truncate mb-1" title={cat.title}>
                {cat.title.split('(')[0]}
              </div>
              <div className="text-base font-bold">
                {cat.isPenalty ? (
                  <span className="text-red-700">-{cat.cappedPoints} pts</span>
                ) : (
                  <span>
                    {cat.cappedPoints} <span className="text-xs font-normal text-slate-400">/ {cat.maxPoints}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
