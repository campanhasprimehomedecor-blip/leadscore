import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CATEGORIES } from './data/questions';
import { calculateLeadScore, generateCopyText } from './utils/calculator';
import { sfx } from './utils/audio';
import { Header } from './components/Header';
import { LeadNameInput } from './components/LeadNameInput';
import { QuestionCategory } from './components/QuestionCategory';
import { LeadRadarChart } from './components/LeadRadarChart';
import { ResultSection } from './components/ResultSection';
import { Category, Question } from './types';
import {
  RotateCcw,
  Copy,
  Check,
  Flame,
  Zap,
  Snowflake,
  Clock,
  Sparkles,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface StepPair {
  stepIndex: number;
  category: Category;
  questions: Question[];
  title: string;
}

export default function App() {
  const [leadName, setLeadName] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copiedSticky, setCopiedSticky] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  // Focus index inside current step (0 or 1 for 2-questions mode)
  const [focusedIndexInStep, setFocusedIndexInStep] = useState(0);

  // Group all questions into pairs (2 questions per step)
  const stepPairs = useMemo<StepPair[]>(() => {
    const pairs: StepPair[] = [];
    let currentPair: Question[] = [];
    let stepCount = 0;

    CATEGORIES.forEach((cat) => {
      cat.questions.forEach((q) => {
        currentPair.push(q);
        if (currentPair.length === 2) {
          pairs.push({
            stepIndex: stepCount,
            category: cat,
            questions: [...currentPair],
            title: `${cat.title.split('(')[0].trim()}`,
          });
          stepCount++;
          currentPair = [];
        }
      });
    });

    if (currentPair.length > 0) {
      const lastCat = CATEGORIES[CATEGORIES.length - 1];
      pairs.push({
        stepIndex: stepCount,
        category: lastCat,
        questions: [...currentPair],
        title: `${lastCat.title.split('(')[0].trim()}`,
      });
    }

    return pairs;
  }, []);

  const totalSteps = stepPairs.length;
  const activeStepPair = stepPairs[currentStep] || stepPairs[0];

  const activeFocusedQuestion = useMemo(() => {
    if (!activeStepPair || !activeStepPair.questions) return null;
    return activeStepPair.questions[focusedIndexInStep] || activeStepPair.questions[0];
  }, [activeStepPair, focusedIndexInStep]);

  const focusedQuestionId = activeFocusedQuestion?.id || '';

  const activeStepCappedPoints = useMemo(() => {
    if (!activeStepPair) return 0;
    return activeStepPair.questions.reduce((sum, q) => {
      const val = answers[q.id];
      const opt = q.options?.find((o) => o.value === val);
      return sum + (opt?.points || 0);
    }, 0);
  }, [activeStepPair, answers]);

  const activeStepMaxPoints = useMemo(() => {
    if (!activeStepPair) return 0;
    return activeStepPair.questions.reduce((sum, q) => {
      const maxOpt = Math.max(...(q.options?.map((o) => o.points) || [0]));
      return sum + maxOpt;
    }, 0);
  }, [activeStepPair]);

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const handleClear = useCallback(() => {
    setAnswers({});
    setLeadName('');
    setCurrentStep(0);
    setFocusedIndexInStep(0);
    sfx.playSelect();
  }, []);

  const scoreResult = useMemo(() => {
    return calculateLeadScore(answers, leadName);
  }, [answers, leadName]);

  const handleToggleSound = () => {
    const newState = sfx.toggleSound();
    setSoundOn(newState);
    if (newState) sfx.playConfirm();
  };

  // Keyboard navigation logic
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if (!activeFocusedQuestion) return;

      const validOptions = activeFocusedQuestion.options?.filter((o) => o.value !== '') || [];
      const currentSelectedVal = answers[activeFocusedQuestion.id] || '';
      const currentOptIndex = validOptions.findIndex((o) => o.value === currentSelectedVal);

      // ArrowUp or ArrowDown: switch question
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndexInStep((prev) => (prev === 0 ? 1 : 0));
        sfx.playSelect();
        return;
      }

      // ArrowRight: next option
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentOptIndex + 1) % validOptions.length;
        const nextVal = validOptions[nextIndex]?.value || '';
        handleAnswerChange(activeFocusedQuestion.id, nextVal);
        sfx.playSelect();
        return;
      }

      // ArrowLeft: prev option
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentOptIndex - 1 + validOptions.length) % validOptions.length;
        const prevVal = validOptions[prevIndex]?.value || '';
        handleAnswerChange(activeFocusedQuestion.id, prevVal);
        sfx.playSelect();
        return;
      }

      // Numbers 1, 2, 3
      if (['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        const numIdx = parseInt(e.key, 10) - 1;
        if (validOptions[numIdx]) {
          handleAnswerChange(activeFocusedQuestion.id, validOptions[numIdx].value);
          sfx.playSelect();
        }
        return;
      }

      // ENTER: Confirm & advance
      if (e.key === 'Enter') {
        e.preventDefault();
        sfx.playConfirm();

        if (focusedIndexInStep === 0 && activeStepPair.questions.length > 1) {
          setFocusedIndexInStep(1);
        } else {
          if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
            setFocusedIndexInStep(0);
          } else {
            sfx.playVictory();
            setShowFullDetails(true);
          }
        }
        return;
      }

      // Backspace: back
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (focusedIndexInStep === 1) {
          setFocusedIndexInStep(0);
          sfx.playSelect();
        } else if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
          setFocusedIndexInStep(1);
          sfx.playSelect();
        }
      }
    },
    [
      activeFocusedQuestion,
      answers,
      focusedIndexInStep,
      activeStepPair,
      currentStep,
      totalSteps,
      handleAnswerChange,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleStickyCopy = () => {
    const text = generateCopyText(scoreResult, leadName);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSticky(true);
      sfx.playConfirm();
      setTimeout(() => setCopiedSticky(false), 2500);
    });
  };

  const getBadgeIcon = (classification: string) => {
    switch (classification) {
      case 'Lead Quente':
        return <Flame className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />;
      case 'Lead Morno':
        return <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />;
      case 'Lead Frio':
        return <Snowflake className="w-4 h-4 text-sky-500 shrink-0" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased pb-20">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4">
        {/* Sleek Minimal Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-mono font-bold text-xs">
              Setas + Enter
            </kbd>
            <span className="text-xs font-bold text-slate-700">
              Jogo Interativo SDR
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
              title="Som Arcade"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={handleClear}
              type="button"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT: 2 QUESTIONS PER STEP */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-3">
            <LeadNameInput value={leadName} onChange={setLeadName} />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
              {/* Step Title & Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-700 font-extrabold uppercase tracking-wide">
                    Etapa {currentStep + 1}/{totalSteps}: {activeStepPair?.title}
                  </span>
                  <span className="text-slate-400">
                    {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / totalSteps) * 100}%`,
                    }}
                  />
                </div>

                {/* Step Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1 no-scrollbar">
                  {stepPairs.map((pair, idx) => {
                    const isCompleted = pair.questions.every(
                      (q) => answers[q.id] !== undefined && answers[q.id] !== ''
                    );
                    const isCurrent = currentStep === idx;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCurrentStep(idx);
                          setFocusedIndexInStep(0);
                          sfx.playSelect();
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all shrink-0 ${
                          isCurrent
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                            : isCompleted
                            ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        Etapa {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2 Questions Card */}
              {activeStepPair && (
                <QuestionCategory
                  category={{
                    id: activeStepPair.category.id,
                    title: activeStepPair.title,
                    maxPoints: activeStepMaxPoints,
                    isPenalty: activeStepPair.category.isPenalty,
                    questions: activeStepPair.questions,
                  }}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  categoryRawPoints={activeStepCappedPoints}
                  categoryCappedPoints={activeStepCappedPoints}
                  focusedQuestionId={focusedQuestionId}
                  onFocusQuestion={(qId) => {
                    const idx = activeStepPair.questions.findIndex((q) => q.id === qId);
                    if (idx !== -1) setFocusedIndexInStep(idx);
                  }}
                />
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (focusedIndexInStep === 1) {
                      setFocusedIndexInStep(0);
                    } else {
                      setCurrentStep((prev) => Math.max(0, prev - 1));
                      setFocusedIndexInStep(1);
                    }
                    sfx.playSelect();
                  }}
                  disabled={currentStep === 0 && focusedIndexInStep === 0}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sfx.playConfirm();
                    if (focusedIndexInStep === 0 && activeStepPair.questions.length > 1) {
                      setFocusedIndexInStep(1);
                    } else if (currentStep < totalSteps - 1) {
                      setCurrentStep((prev) => prev + 1);
                      setFocusedIndexInStep(0);
                    } else {
                      sfx.playVictory();
                      setShowFullDetails(true);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <span>
                    {currentStep === totalSteps - 1 && focusedIndexInStep === 1
                      ? 'Ver Relatório'
                      : 'Avançar [Enter]'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: RADAR CHART */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <LeadRadarChart result={scoreResult} />

            <div className="text-center">
              <button
                onClick={() => setShowFullDetails(!showFullDetails)}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {showFullDetails ? 'Ocultar Relatório' : 'Ver Relatório Completo'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Details Section */}
        {showFullDetails && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <ResultSection
              result={scoreResult}
              leadName={leadName}
              onClear={handleClear}
              onNewEvaluation={handleClear}
              onCalculateScroll={() => {}}
            />
          </div>
        )}
      </main>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-900 text-white border-t border-slate-800 p-2 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-3">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-amber-400">
                {scoreResult.totalScore}
              </span>
              <span className="text-[10px] text-slate-400">/100</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-bold">
              {getBadgeIcon(scoreResult.classification)}
              <span>{scoreResult.classification}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              type="button"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleStickyCopy}
              type="button"
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 border ${
                copiedSticky
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
              }`}
            >
              {copiedSticky ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Resumo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
