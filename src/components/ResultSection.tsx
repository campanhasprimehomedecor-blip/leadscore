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
          textColor: 'text-red-600',
        };
      case 'Lead Morno':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
          icon: <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />,
          barColor: 'bg-amber-500',
          textColor: 'text-amber-600',
        };
      case 'Lead Frio':
        return {
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-600',
          icon: <Snowflake className="w-5 h-5 text-sky-500" />,
          barColor: 'bg-sky-500',
          textColor: 'text-sky-600',
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-600',
          icon: <Clock className="w-5 h-5 text-slate-500" />,
          barColor: 'bg-slate-400',
          textColor: 'text-slate-600',
        };
    }
  };

  const badge = getBadgeStyle(result.classification);

  return (
    <div id="resultado-section" className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-8 mt-8 space-y-8">
      {/* Top Header & Buttons Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Resultado da Avaliação
          </h2>
          {leadName && (
            <p className="text-sm font-medium text-slate-500 mt-1">
              Lead: <span className="text-slate-800 font-semibold">{leadName}</span>
            </p>
          )}
        </div>

        {/* Action Buttons Grid for Mobile / Flex for Desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <button
            onClick={onCalculateScroll}
            type="button"
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Calcular</span>
          </button>

          <button
            onClick={onClear}
            type="button"
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar</span>
          </button>

          <button
            onClick={onNewEvaluation}
            type="button"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Nova Avaliação</span>
          </button>

          <button
            onClick={handleCopy}
            type="button"
            className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs border ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Resultado</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Score & Classification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Big Score Box */}
        <div className="bg-slate-900 text-white rounded-xl p-6 text-center flex flex-col items-center justify-center shadow-xs">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
            Score Total
          </span>
          <div className="text-5xl sm:text-6xl font-black text-amber-400 my-2">
            {result.totalScore}
            <span className="text-2xl text-slate-400 font-normal"> / 100</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${badge.barColor}`}
              style={{ width: `${Math.min(100, Math.max(0, result.totalScore))}%` }}
            />
          </div>
        </div>

        {/* Classification Badge */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-center items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            Classificação
          </span>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-lg font-bold mb-3 ${badge.bg}`}>
            {badge.icon}
            <span>{result.classification}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Nível de qualificação calculado com base na matriz de respostas e penalizações.
          </p>
        </div>

        {/* Recommendation Box */}
        <div className="bg-amber-50/60 rounded-xl p-6 border border-amber-200 flex flex-col justify-center items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 mb-2">
            Recomendação Comercial
          </span>
          <p className="text-base font-bold text-amber-950 leading-snug">
            {result.recommendation}
          </p>
          <span className="text-xs text-amber-700 mt-2">
            Ação sugerida para o time de vendas Prime Home Decor.
          </span>
        </div>
      </div>

      {/* Category Score Breakdown */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4">
          Pontuação por Categoria
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {result.categoryResults.map((cat) => (
            <div
              key={cat.id}
              className={`p-3.5 rounded-xl border ${
                cat.isPenalty
                  ? 'bg-red-50/50 border-red-200 text-red-900'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="text-xs font-semibold text-slate-600 truncate mb-1" title={cat.title}>
                {cat.title}
              </div>
              <div className="text-lg font-bold">
                {cat.isPenalty ? (
                  <span className="text-red-700">-{cat.cappedPoints} pts</span>
                ) : (
                  <span>
                    {cat.cappedPoints} <span className="text-xs font-normal text-slate-500">/ {cat.maxPoints}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary of Selected Answers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Respostas Selecionadas ({result.answersSummary.length})
          </h3>
          {result.answersSummary.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Nenhuma opção pontuável selecionada ainda.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 text-xs">
              {result.answersSummary.map((item) => (
                <li key={item.questionId} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-2">
                  <span className="text-slate-700 font-medium leading-tight">{item.question}</span>
                  <span className="shrink-0 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.answerLabel} (+{item.points})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Applied Penalties */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Penalizações Aplicadas ({result.penaltiesApplied.length})
          </h3>
          {result.penaltiesApplied.length === 0 ? (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              Nenhuma penalização identificada neste lead.
            </div>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 text-xs">
              {result.penaltiesApplied.map((item) => (
                <li key={item.questionId} className="p-2.5 rounded-lg bg-red-50/70 border border-red-200 flex items-start justify-between gap-2">
                  <span className="text-red-900 font-medium leading-tight">{item.question}</span>
                  <span className="shrink-0 font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                    {item.answerLabel} (-{item.points})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
