import React, { useState, useMemo } from 'react';
import { CATEGORIES } from './data/questions';
import { calculateLeadScore, generateCopyText } from './utils/calculator';
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
  LayoutGrid,
  Layers
} from 'lucide-react';

// Flatten questions into 2-question steps for ultra fast SDR workflow
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
  const [isExpandedMode, setIsExpandedMode] = useState(false); // false = 2 preguntas por etapa, true = visão expandida

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

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleClear = () => {
    setAnswers({});
    setLeadName('');
    setCurrentStep(0);
  };

  const scoreResult = useMemo(() => {
    return calculateLeadScore(answers, leadName);
  }, [answers, leadName]);

  const handleStickyCopy = () => {
    const text = generateCopyText(scoreResult, leadName);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSticky(true);
      setTimeout(() => setCopiedSticky(false), 2500);
    });
  };

  // Badge helper for floating bar
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

  const activeStepPair = stepPairs[currentStep] || stepPairs[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased pb-24">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* SDR Toolbar & Mode Switcher */}
        <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3 shadow-2xs mb-4 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Qualificação SDR Express
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle 2 Perguntas vs Visão Geral */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setIsExpandedMode(false)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                  !isExpandedMode
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>2 Perguntas / Etapa</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExpandedMode(true)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                  isExpandedMode
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
                <span>Ver Todas</span>
              </button>
            </div>

            <button
              onClick={handleClear}
              type="button"
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors active:scale-95"
              title="Limpar formulário para próximo lead"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: 2 PERGUNTAS POR ETAPA */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-3">
            <LeadNameInput value={leadName} onChange={setLeadName} />

            {!isExpandedMode ? (
              /* WIZARD MODE: 2 PERGUNTAS POR ETAPA */
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-4">
                {/* Step Progress Bar & Pills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="text-amber-700">
                      Etapa {currentStep + 1} de {totalSteps}: {activeStepPair?.title}
                    </span>
                    <span className="text-slate-400 font-semibold">
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
                          onClick={() => setCurrentStep(idx)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold border transition-all shrink-0 ${
                            isCurrent
                              ? 'bg-amber-500 text-white border-amber-600'
                              : isCompleted
                              ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          E{idx + 1}
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
                      maxPoints: activeStepPair.category.maxPoints,
                      isPenalty: activeStepPair.category.isPenalty,
                      questions: activeStepPair.questions,
                    }}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    categoryRawPoints={0}
                    categoryCappedPoints={0}
                  />
                )}

                {/* Navigation Controls */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1))
                    }
                    disabled={currentStep === totalSteps - 1}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <span>
                      {currentStep === totalSteps - 1
                        ? 'Última Etapa'
                        : 'Próxima (2 Qs)'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* EXPANDED MODE: TODAS AS PERGUNTAS */
              <div className="space-y-3">
                {CATEGORIES.map((category) => {
                  const catResult = scoreResult.categoryResults.find(
                    (c) => c.id === category.id
                  );
                  return (
                    <QuestionCategory
                      key={category.id}
                      category={category}
                      answers={answers}
                      onAnswerChange={handleAnswerChange}
                      categoryRawPoints={catResult?.rawPoints || 0}
                      categoryCappedPoints={catResult?.cappedPoints || 0}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: RADAR DE CALOR */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <LeadRadarChart result={scoreResult} />

            {/* Toggle Full Result Breakdown */}
            <div className="text-center pt-1">
              <button
                onClick={() => setShowFullDetails(!showFullDetails)}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200/70 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {showFullDetails
                    ? 'Ocultar Relatório Detalhado'
                    : 'Ver Relatório Completo & Justificativas'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Details Section (Expandable on demand) */}
        {showFullDetails && (
          <div className="mt-8 border-t border-slate-200 pt-6">
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

      {/* STICKY SDR QUICK ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 p-2.5 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-2 sm:px-4">
          {/* Live Score Display */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-amber-400 leading-none">
                  {scoreResult.totalScore}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">/100</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold">
              {getBadgeIcon(scoreResult.classification)}
              <span>{scoreResult.classification}</span>
            </div>
          </div>

          {/* SDR Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              type="button"
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>

            <button
              onClick={handleStickyCopy}
              type="button"
              className={`px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95 border ${
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
                  <span>Copiar Resumo WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Prime Home Decor &copy; {new Date().getFullYear()} — SDR Lead Scoring</span>
          <span className="text-slate-500">
            100% Client-Side &bull; Radar de Calor Interativo
          </span>
        </div>
      </footer>
    </div>
  );
}

