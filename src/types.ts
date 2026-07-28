export interface QuestionOption {
  label: string;
  value: string;
  points: number;
}

export interface Question {
  id: string;
  text: string;
  options?: QuestionOption[]; // optional custom options override (e.g. Urgencia timeline)
}

export interface Category {
  id: string;
  title: string;
  maxPoints: number;
  isPenalty?: boolean;
  questions: Question[];
}

export type ClassificationType = 'Lead Quente' | 'Lead Morno' | 'Lead Frio' | 'Baixa prioridade';

export interface CategoryResult {
  id: string;
  title: string;
  rawPoints: number;
  cappedPoints: number;
  maxPoints: number;
  isPenalty?: boolean;
}

export interface AnswerSummaryItem {
  questionId: string;
  question: string;
  answerLabel: string;
  points: number;
  categoryTitle: string;
  isPenalty?: boolean;
}

export interface LeadScoreResult {
  totalScore: number;
  classification: ClassificationType;
  recommendation: string;
  categoryResults: CategoryResult[];
  answersSummary: AnswerSummaryItem[];
  penaltiesApplied: AnswerSummaryItem[];
}
