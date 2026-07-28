import React from 'react';
import { Category } from '../types';
import { Check, AlertTriangle } from 'lucide-react';

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
  categoryCappedPoints,
}) => {
  const isPenalty = category.isPenalty;

  return (
    <div
      className={`rounded-xl border shadow-2xs overflow-hidden transition-all bg-white ${
        isPenalty ? 'border-red-200' : 'border-slate-200'
      }`}
    >
      {/* Category Header */}
      <div
        className={`px-3.5 py-2.5 flex items-center justify-between gap-2 border-b ${
          isPenalty
            ? 'bg-red-50/70 border-red-100 text-red-950'
            : 'bg-slate-50/90 border-slate-200/80 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-1.5">
          {isPenalty && <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />}
          <h2 className="text-xs sm:text-sm font-bold tracking-tight">
            {category.title}
          </h2>
        </div>
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0 ${
            isPenalty
              ? categoryCappedPoints > 0
                ? 'bg-red-100 text-red-800'
                : 'bg-slate-100 text-slate-500'
              : categoryCappedPoints > 0
              ? 'bg-amber-100 text-amber-900'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {isPenalty
            ? `-${categoryCappedPoints} pts`
            : `${categoryCappedPoints}/${category.maxPoints} pts`}
        </span>
      </div>

      {/* Questions List */}
      <div className="p-3 space-y-2.5">
        {category.questions.map((q) => {
          const selectedValue = answers[q.id] || '';

          return (
            <div
              key={q.id}
              className={`p-2.5 rounded-lg border transition-all ${
                selectedValue !== ''
                  ? isPenalty && selectedValue === 'sim'
                    ? 'bg-red-50/40 border-red-300'
                    : 'bg-amber-50/30 border-amber-300'
                  : 'bg-slate-50/50 border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-medium text-slate-800 leading-tight">
                  {q.text}
                </label>

                {/* 1-Click Fast Button Chips */}
                <div className="flex items-center gap-1 shrink-0">
                  {q.options?.map((opt) => {
                    if (opt.value === '') return null; // Skip placeholder

                    const isSelected = selectedValue === opt.value;
                    const isPositive = opt.points > 0 && !isPenalty;
                    const isPenaltyHit = opt.points > 0 && isPenalty;

                    let buttonStyle =
                      'bg-white text-slate-600 border-slate-200 hover:bg-slate-100';

                    if (isSelected) {
                      if (isPenaltyHit) {
                        buttonStyle =
                          'bg-red-600 text-white border-red-700 font-bold shadow-2xs';
                      } else if (isPositive) {
                        buttonStyle =
                          'bg-amber-600 text-white border-amber-700 font-bold shadow-2xs';
                      } else {
                        buttonStyle =
                          'bg-slate-800 text-white border-slate-900 font-bold shadow-2xs';
                      }
                    }

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          onAnswerChange(q.id, isSelected ? '' : opt.value)
                        }
                        className={`px-2.5 py-1 rounded-md border text-[11px] transition-all flex items-center gap-1 active:scale-95 ${buttonStyle}`}
                      >
                        {isSelected && <Check className="w-3 h-3 shrink-0" />}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
