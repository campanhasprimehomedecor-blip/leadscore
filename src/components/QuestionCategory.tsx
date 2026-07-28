import React from 'react';
import { Category } from '../types';
import { Check, CornerDownLeft } from 'lucide-react';

interface QuestionCategoryProps {
  category: Category;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  categoryRawPoints?: number;
  categoryCappedPoints?: number;
  focusedQuestionId?: string;
  onFocusQuestion?: (questionId: string) => void;
}

export const QuestionCategory: React.FC<QuestionCategoryProps> = ({
  category,
  answers,
  onAnswerChange,
  focusedQuestionId,
  onFocusQuestion,
}) => {
  return (
    <div className="space-y-3">
      {category.questions.map((q, qIndex) => {
        const selectedValue = answers[q.id] || '';
        const isFocused = focusedQuestionId === q.id;

        return (
          <div
            key={q.id}
            onClick={() => onFocusQuestion?.(q.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              isFocused
                ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20 shadow-sm'
                : selectedValue !== ''
                ? 'bg-slate-50 border-slate-200'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col gap-3">
              {/* Question Title */}
              <div className="flex items-start gap-2.5">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                    isFocused
                      ? 'bg-amber-500 text-white'
                      : selectedValue
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {qIndex + 1}
                </span>
                <label className="text-sm font-bold text-slate-900 leading-snug cursor-pointer">
                  {q.text}
                </label>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {q.options?.map((opt, optIndex) => {
                  if (opt.value === '') return null;

                  const isSelected = selectedValue === opt.value;
                  const isPenalty = category.isPenalty && opt.points > 0;

                  let btnStyle =
                    'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';

                  if (isSelected) {
                    btnStyle = isPenalty
                      ? 'bg-red-600 text-white border-red-700 font-bold shadow-2xs'
                      : 'bg-amber-600 text-white border-amber-700 font-bold shadow-2xs';
                  } else if (isFocused) {
                    btnStyle += ' border-amber-300';
                  }

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFocusQuestion?.(q.id);
                        onAnswerChange(q.id, opt.value);
                      }}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all flex items-center justify-between gap-1 active:scale-95 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] font-bold opacity-60">
                          [{optIndex + 1}]
                        </span>
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Micro Indicator for Active Question */}
            {isFocused && (
              <div className="mt-2.5 pt-2 border-t border-amber-200/50 flex items-center justify-between text-[11px] text-amber-900 font-medium">
                <span className="text-slate-500">
                  <kbd className="px-1 py-0.5 bg-amber-100 rounded text-[10px] font-mono font-bold">← →</kbd> escolher &bull; <kbd className="px-1 py-0.5 bg-amber-100 rounded text-[10px] font-mono font-bold">↑ ↓</kbd> mudar pergunta
                </span>
                <span className="font-extrabold flex items-center gap-0.5 text-amber-800">
                  Enter <CornerDownLeft className="w-3 h-3" />
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
