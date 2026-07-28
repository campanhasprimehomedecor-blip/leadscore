import React, { useState, useMemo } from 'react';
import { CATEGORIES } from './data/questions';
import { calculateLeadScore } from './utils/calculator';
import { Header } from './components/Header';
import { LeadNameInput } from './components/LeadNameInput';
import { QuestionCategory } from './components/QuestionCategory';
import { ResultSection } from './components/ResultSection';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, BarChart3, Award } from 'lucide-react';

export default function App() {
  const [leadName, setLeadName] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleClear = () => {
    setAnswers({});
  };

  const handleNewEvaluation = () => {
    setAnswers({});
    setLeadName('');
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scoreResult = useMemo(() => {
    return calculateLeadScore(answers, leadName);
  }, [answers, leadName]);

  const totalSteps = 6; // 5 categories + 1 result step
  const isResultStep = currentStep === 5;

  const currentCategory = currentStep < 5 ? CATEGORIES[currentStep] : null;
  const currentCatResult = currentCategory
    ? scoreResult.categoryResults.find((c) => c.id === currentCategory.id)
    : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Step Indicator Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-3 shadow-xs mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2 px-1">
            <span>
              {isResultStep ? 'Resultado da Avaliação' : `Etapa ${currentStep + 1} de 5: ${currentCategory?.title.split('(')[0]}`}
            </span>
            <span className="text-amber-600 font-bold">
              Score Atual: {scoreResult.totalScore}/100
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {CATEGORIES.map((cat, idx) => {
              const isActive = currentStep === idx;
              const isCompleted = currentStep > idx;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleGoToStep(idx)}
                  type="button"
                  className={`py-2 px-1 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center gap-0.5 border ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                      : isCompleted
                      ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate max-w-full">{cat.title.split('.')[1]?.split('(')[0]?.trim() || `Etapa ${idx + 1}`}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />}
                </button>
              );
            })}

            {/* Result Tab */}
            <button
              onClick={() => handleGoToStep(5)}
              type="button"
              className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                isResultStep
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs'
                  : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
              }`}
            >
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Resultado</span>
              </span>
            </button>
          </div>
        </div>

        {/* Lead Name Input (Available on active question steps) */}
        {!isResultStep && (
          <LeadNameInput value={leadName} onChange={setLeadName} />
        )}

        {/* Active Step Content */}
        {!isResultStep && currentCategory && (
          <div>
            <QuestionCategory
              category={currentCategory}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              categoryRawPoints={currentCatResult?.rawPoints || 0}
              categoryCappedPoints={currentCatResult?.cappedPoints || 0}
            />

            {/* Step Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs mt-6">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                type="button"
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Etapa Anterior</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleClear}
                  type="button"
                  className="px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>

                <button
                  onClick={() => handleGoToStep(5)}
                  type="button"
                  className="px-3 py-2.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-amber-700" />
                  <span>Ver Resultado ({scoreResult.totalScore} pts)</span>
                </button>
              </div>

              <button
                onClick={handleNextStep}
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{currentStep === 4 ? 'Calcular e Ver Resultado' : 'Próxima Etapa'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Full Result Section */}
        {isResultStep && (
          <div className="space-y-4">
            <ResultSection
              result={scoreResult}
              leadName={leadName}
              onClear={handleClear}
              onNewEvaluation={handleNewEvaluation}
              onCalculateScroll={() => handleGoToStep(5)}
            />

            <div className="text-center pt-2">
              <button
                onClick={() => handleGoToStep(0)}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar e revisar perguntas</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Prime Home Decor &copy; {new Date().getFullYear()} — Avaliação Interna de Leads</span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            Lead Scoring por Etapas (100% Client-Side)
          </span>
        </div>
      </footer>
    </div>
  );
}

