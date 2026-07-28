import { Category, QuestionOption } from '../types';

export const STANDARD_YES_NO_OPTIONS = (simPoints: number): QuestionOption[] => [
  { label: 'Selecione uma opção', value: '', points: 0 },
  { label: 'Sim', value: 'sim', points: simPoints },
  { label: 'Não', value: 'nao', points: 0 },
  { label: 'Não tenho essa informação', value: 'sem_info', points: 0 },
];

export const CATEGORIES: Category[] = [
  {
    id: 'perfil',
    title: '1. Perfil do Lead (Máx. 30 pts)',
    maxPoints: 30,
    questions: [
      {
        id: 'p1',
        text: 'Está decorando ou mobiliando um ambiente completo?',
        options: STANDARD_YES_NO_OPTIONS(10),
      },
      {
        id: 'p2',
        text: 'Possui arquiteto, designer ou projeto em andamento?',
        options: STANDARD_YES_NO_OPTIONS(6),
      },
      {
        id: 'p3',
        text: 'Procura móveis clássicos, importados ou premium?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'p4',
        text: 'Demonstra compatibilidade com produtos de ticket alto?',
        options: STANDARD_YES_NO_OPTIONS(6),
      },
    ],
  },
  {
    id: 'intencao',
    title: '2. Intenção de Compra (Máx. 35 pts)',
    maxPoints: 35,
    questions: [
      {
        id: 'i1',
        text: 'Perguntou o preço de um produto específico?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'i2',
        text: 'Perguntou sobre prazo, frete ou pagamento?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'i3',
        text: 'Enviou foto do ambiente ou pediu orçamento?',
        options: STANDARD_YES_NO_OPTIONS(10),
      },
      {
        id: 'i4',
        text: 'Perguntou disponibilidade ou comparou modelos?',
        options: STANDARD_YES_NO_OPTIONS(9),
      },
    ],
  },
  {
    id: 'origem',
    title: '3. Origem e Engajamento (Máx. 20 pts)',
    maxPoints: 20,
    questions: [
      {
        id: 'o1',
        text: 'Veio de uma campanha ou anúncio?',
        options: STANDARD_YES_NO_OPTIONS(5),
      },
      {
        id: 'o2',
        text: 'Chamou no WhatsApp após ver um anúncio ou publicação?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'o3',
        text: 'Pediu outras opções ou retomou a conversa?',
        options: STANDARD_YES_NO_OPTIONS(7),
      },
    ],
  },
  {
    id: 'urgencia',
    title: '4. Urgência (Máx. 15 pts)',
    maxPoints: 15,
    questions: [
      {
        id: 'u1',
        text: 'Quando o lead pretende comprar?',
        options: [
          { label: 'Selecione o prazo', value: '', points: 0 },
          { label: 'Em até 7 dias', value: '7_dias', points: 10 },
          { label: 'Em até 30 dias', value: '30_dias', points: 7 },
          { label: 'Depois de 30 dias', value: 'apos_30_dias', points: 2 },
          { label: 'Ainda não sabe', value: 'nao_sabe', points: 0 },
          { label: 'Não tenho essa informação', value: 'sem_info', points: 0 },
        ],
      },
      {
        id: 'u2',
        text: 'O lead responde rapidamente?',
        options: STANDARD_YES_NO_OPTIONS(5),
      },
    ],
  },
  {
    id: 'penalizacoes',
    title: '5. Penalizações (Máx. 30 pts negativos)',
    maxPoints: 30,
    isPenalty: true,
    questions: [
      {
        id: 'pen1',
        text: 'Perguntou apenas o preço e desapareceu?',
        options: STANDARD_YES_NO_OPTIONS(10),
      },
      {
        id: 'pen2',
        text: 'Disse que está apenas pesquisando?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'pen3',
        text: 'Pediu desconto antes de conhecer o produto?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'pen4',
        text: 'Não respondeu após duas tentativas?',
        options: STANDARD_YES_NO_OPTIONS(10),
      },
      {
        id: 'pen5',
        text: 'Não possui perfil premium ou o contato é inválido?',
        options: STANDARD_YES_NO_OPTIONS(20),
      },
    ],
  },
];
