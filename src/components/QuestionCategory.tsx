import React from 'react';
import { Category } from '../types';

interface QuestionCategoryProps {
  category: Category;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  categoryRawPoints: number;
  categoryCappedPoints: number;
}

export const QuestionCategory: React.FC<QuestionCategoryProps> = ({
  category,
  answers,
  onAnswerChange,
  categoryRawPoints,
  categoryCappedPoints,
}) => {
  const isPenalty = category.isPenalty;

  return (
    <div className={`rounded-xl border shadow-xs mb-6 overflow-hidden transition-all bg-white ${
      isPenalty ? 'border-red-200' : 'border-slate-200'
    }`}>
      {/* Category Header */}
      <div className={`px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${
        isPenalty ? 'bg-red-50/70 border-red-100 text-red-950' : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div>
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
            {category.title}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className={`px-2.5 py-1 rounded-full border ${
            isPenalty
              ? categoryCappedPoints > 0
                ? 'bg-red-100 text-red-800 border-red-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
              : categoryCappedPoints > 0
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {isPenalty
              ? `Penalização: -${categoryCappedPoints} pts`
              : `Pontuação: ${categoryCappedPoints}/${category.maxPoints} pts`}
          </span>
        </div>
      </div>

      {/* Questions list */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {category.questions.map((q, idx) => {
          const selectedValue = answers[q.id] || '';
          return (
            <div key={q.id} className="p-3.5 bg-slate-50/60 border border-slate-200/80 rounded-lg flex flex-col justify-between space-y-2.5 hover:border-slate-300 transition-colors">
              <label htmlFor={`select-${q.id}`} className="block text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                {idx + 1}. {q.text}
              </label>
              <div className="relative">
                <select
                  id={`select-${q.id}`}
                  value={selectedValue}
                  onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  className={`w-full py-2 px-3 pr-8 rounded-lg border text-xs sm:text-sm font-medium bg-white focus:outline-hidden focus:ring-2 transition-all appearance-none cursor-pointer ${
                    selectedValue === ''
                      ? 'border-slate-300 text-slate-500 focus:ring-amber-500'
                      : isPenalty && selectedValue === 'sim'
                      ? 'border-red-300 bg-red-50/60 text-red-900 focus:ring-red-500 font-semibold'
                      : 'border-amber-400 bg-amber-50/40 text-slate-900 focus:ring-amber-500 font-semibold'
                  }`}
                >
                  {q.options?.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-slate-900 py-1">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
