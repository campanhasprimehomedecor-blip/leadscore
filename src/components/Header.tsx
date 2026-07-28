import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white border-b border-amber-500/20 py-8 px-4 sm:px-6 shadow-lg">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Prime Home Decor</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
          App de Lead Scoring
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Avaliação rápida e precisa do potencial comercial de cada lead. Cálculo instantâneo direto no navegador.
        </p>
      </div>
    </header>
  );
};
