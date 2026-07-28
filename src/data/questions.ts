import { Category, QuestionOption } from '../types';

export const STANDARD_YES_NO_OPTIONS = (simPoints: number): QuestionOption[] => [
  { label: 'Selecione', value: '', points: 0 },
  { label: 'Sim', value: 'sim', points: simPoints },
  { label: 'Não', value: 'nao', points: 0 },
  { label: 'Sem info', value: 'sem_info', points: 0 },
];

export const CATEGORIES: Category[] = [
  {
    id: 'perfil',
    title: '1. Perfil do Lead (Máx. 30 pts)',
    maxPoints: 30,
    questions: [
      {
        id: 'p1',
        text: 'Mobiliando ambiente completo?',
        options: STANDARD_YES_NO_OPTIONS(10),
      },
      {
        id: 'p2',
        text: 'Tem arquiteto ou projeto?',
        options: STANDARD_YES_NO_OPTIONS(6),
      },
      {
        id: 'p3',
        text: 'Busca móveis clássicos/premium?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'p4',
        text: 'Perfil compatível com ticket alto?',
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
        text: 'Perguntou preço de item específico?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'i2',
        text: 'Perguntou sobre frete/prazo/pagamento?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'i3',
        text: 'Enviou foto ou pediu orçamento?',
        options: STANDARD_YES_NO_OPTIONS(10),
      },
      {
        id: 'i4',
        text: 'Consultou estoque ou comparou?',
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
        text: 'Veio de anúncio ou campanha?',
        options: STANDARD_YES_NO_OPTIONS(5),
      },
      {
        id: 'o2',
        text: 'Chamo no WhatsApp via anúncio?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'o3',
        text: 'Pediu opções ou retomou contato?',
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
        text: 'Prazo previsto para compra:',
        options: [
          { label: 'Selecione', value: '', points: 0 },
          { label: 'Até 7 dias', value: '7_dias', points: 10 },
          { label: 'Até 30 dias', value: '30_dias', points: 7 },
          { label: 'Mais de 30 dias', value: 'apos_30_dias', points: 2 },
          { label: 'Ainda não sabe', value: 'nao_sabe', points: 0 },
        ],
      },
      {
        id: 'u2',
        text: 'Lead responde rápido no chat?',
        options: STANDARD_YES_NO_OPTIONS(5),
      },
    ],
  },
  {
    id: 'penalizacoes',
    title: '5. Sinais de Alerta (Penalizações)',
    maxPoints: 30,
    isPenalty: true,
    questions: [
      {
        id: 'pen1',
        text: 'Perguntou preço e sumiu (ghosting)?',
        options: STANDARD_YES_NO_OPTIONS(10),
      },
      {
        id: 'pen2',
        text: 'Disse que está só pesquisando?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'pen3',
        text: 'Pediu desconto logo de cara?',
        options: STANDARD_YES_NO_OPTIONS(8),
      },
      {
        id: 'pen4',
        text: 'Sem resposta após 2 tentativas?',
        options: STANDARD_YES_NO_OPTIONS(10),
      },
      {
        id: 'pen5',
        text: 'Contato/número inválido?',
        options: STANDARD_YES_NO_OPTIONS(20),
      },
    ],
  },
];
