import React from 'react';
import { Barbeiro } from '../types';
import { UserCheck, Sparkles, Check } from 'lucide-react';

interface BarberCardProps {
  barbeiro: Barbeiro;
  selected: boolean;
  onSelect: (barbeiro: Barbeiro) => void;
}

export const BarberCard: React.FC<BarberCardProps> = ({
  barbeiro,
  selected,
  onSelect,
}) => {
  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      onClick={() => onSelect(barbeiro)}
      className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex items-center gap-4 ${
        selected
          ? 'bg-barber-elevated/90 border-barber-gold shadow-[0_0_20px_rgba(229,169,60,0.2)] ring-1 ring-barber-gold'
          : 'bg-barber-card/80 border-barber-border hover:border-slate-600 hover:bg-barber-card'
      }`}
    >
      <div className="relative">
        <div
          className={`w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-base transition-colors ${
            selected
              ? 'bg-barber-gold text-black'
              : 'bg-barber-elevated text-barber-gold border border-barber-border'
          }`}
          style={{ width: '52px', height: '52px' }}
        >
          {barbeiro.nome ? getInitials(barbeiro.nome) : <UserCheck className="w-6 h-6" />}
        </div>
        {barbeiro.ativo && (
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0F1115] rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base text-slate-100 truncate">
            {barbeiro.nome}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-barber-gold mt-0.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{barbeiro.especialidade}</span>
        </div>
      </div>

      {selected && (
        <div className="bg-barber-gold text-black rounded-full p-0.5 shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}
    </div>
  );
};
