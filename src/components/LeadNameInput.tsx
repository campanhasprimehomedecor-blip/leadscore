import React from 'react';
import { User } from 'lucide-react';

interface LeadNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const LeadNameInput: React.FC<LeadNameInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6">
      <label htmlFor="lead-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        Identificação do Lead (Opcional)
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <User className="w-5 h-5" />
        </div>
        <input
          id="lead-name-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Ana Maria / Projeto Sala de Estar"
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
        />
      </div>
    </div>
  );
};
