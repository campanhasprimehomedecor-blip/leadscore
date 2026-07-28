import { CATEGORIES } from '../data/questions';
import { AnswerSummaryItem, CategoryResult, ClassificationType, LeadScoreResult } from '../types';

export function calculateLeadScore(
  answers: Record<string, string>,
  leadName?: string
): LeadScoreResult {
  const categoryResults: CategoryResult[] = [];
  const answersSummary: AnswerSummaryItem[] = [];
  const penaltiesApplied: AnswerSummaryItem[] = [];

  let perfilCapped = 0;
  let intencaoCapped = 0;
  let origemCapped = 0;
  let urgenciaCapped = 0;
  let penalizacaoCapped = 0;

  CATEGORIES.forEach((category) => {
    let rawCategorySum = 0;

    category.questions.forEach((q) => {
      const selectedValue = answers[q.id] || '';
      const selectedOption = q.options?.find((opt) => opt.value === selectedValue);

      if (selectedOption && selectedOption.value !== '') {
        const points = selectedOption.points;
        rawCategorySum += points;

        const summaryItem: AnswerSummaryItem = {
          questionId: q.id,
          question: q.text,
          answerLabel: selectedOption.label,
          points: points,
          categoryTitle: category.title,
          isPenalty: category.isPenalty,
        };

        if (category.isPenalty) {
          if (points > 0) {
            penaltiesApplied.push(summaryItem);
          }
        } else {
          answersSummary.push(summaryItem);
        }
      }
    });

    const cappedPoints = Math.min(category.maxPoints, Math.max(0, rawCategorySum));

    categoryResults.push({
      id: category.id,
      title: category.title,
      rawPoints: rawCategorySum,
      cappedPoints: cappedPoints,
      maxPoints: category.maxPoints,
      isPenalty: category.isPenalty,
    });

    if (category.id === 'perfil') perfilCapped = cappedPoints;
    if (category.id === 'intencao') intencaoCapped = cappedPoints;
    if (category.id === 'origem') origemCapped = cappedPoints;
    if (category.id === 'urgencia') urgenciaCapped = cappedPoints;
    if (category.id === 'penalizacoes') penalizacaoCapped = cappedPoints;
  });

  const rawTotal = perfilCapped + intencaoCapped + origemCapped + urgenciaCapped - penalizacaoCapped;
  const totalScore = Math.max(0, Math.min(100, rawTotal));

  let classification: ClassificationType = 'Baixa prioridade';
  let recommendation = 'Manter em acompanhamento leve';

  if (totalScore >= 75) {
    classification = 'Lead Quente';
    recommendation = 'Entrar em contato imediatamente';
  } else if (totalScore >= 50) {
    classification = 'Lead Morno';
    recommendation = 'Realizar follow-up prioritário';
  } else if (totalScore >= 25) {
    classification = 'Lead Frio';
    recommendation = 'Enviar catálogo, opções ou prova social';
  } else {
    classification = 'Baixa prioridade';
    recommendation = 'Manter em acompanhamento leve';
  }

  return {
    totalScore,
    classification,
    recommendation,
    categoryResults,
    answersSummary,
    penaltiesApplied,
  };
}

export function generateCopyText(
  result: LeadScoreResult,
  leadName?: string
): string {
  const dateStr = new Date().toLocaleDateString('pt-BR');
  const nameDisplay = leadName && leadName.trim() ? leadName.trim() : 'Não informado';

  let text = `🏆 AVALIAÇÃO DE LEAD — PRIME HOME DECOR\n`;
  text += `----------------------------------------\n`;
  text += `👤 Lead: ${nameDisplay}\n`;
  text += `📅 Data: ${dateStr}\n\n`;
  text += `⭐ SCORE TOTAL: ${result.totalScore} / 100\n`;
  text += `🔥 CLASSIFICAÇÃO: ${result.classification}\n`;
  text += `💡 RECOMENDAÇÃO: ${result.recommendation}\n\n`;

  text += `📊 PONTUAÇÃO POR CATEGORIA:\n`;
  result.categoryResults.forEach((cat) => {
    if (cat.isPenalty) {
      text += `• ${cat.title}: -${cat.cappedPoints} pts\n`;
    } else {
      text += `• ${cat.title}: ${cat.cappedPoints}/${cat.maxPoints} pts\n`;
    }
  });

  if (result.answersSummary.length > 0) {
    text += `\n✅ PRINCIPAIS RESPOSTAS:\n`;
    result.answersSummary.forEach((item) => {
      text += `- ${item.question}: ${item.answerLabel} (+${item.points})\n`;
    });
  }

  text += `\n⚠️ PENALIZAÇÕES APLICADAS:\n`;
  if (result.penaltiesApplied.length > 0) {
    result.penaltiesApplied.forEach((item) => {
      text += `- ${item.question}: ${item.answerLabel} (-${item.points})\n`;
    });
  } else {
    text += `- Nenhuma penalização identificada.\n`;
  }

  text += `----------------------------------------\n`;
  text += `Prime Home Decor — Sistema Interno de Lead Scoring`;

  return text;
}
