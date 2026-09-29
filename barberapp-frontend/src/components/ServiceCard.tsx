import React from 'react';
import { Servico } from '../types';
import { Scissors, Clock, Check } from 'lucide-react';

interface ServiceCardProps {
  servico: Servico;
  selected: boolean;
  onSelect: (servico: Servico) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  servico,
  selected,
  onSelect,
}) => {
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(servico.preco);

  return (
    <div
      onClick={() => onSelect(servico)}
      className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border text-left ${
        selected
          ? 'bg-barber-elevated/90 border-barber-gold shadow-[0_0_20px_rgba(229,169,60,0.2)] ring-1 ring-barber-gold'
          : 'bg-barber-card/80 border-barber-border hover:border-slate-600 hover:bg-barber-card'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              selected
                ? 'bg-barber-gold text-black'
                : 'bg-barber-elevated text-barber-gold border border-barber-border'
            }`}
          >
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100">{servico.nome}</h3>
            {servico.descricao && (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                {servico.descricao}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-base font-extrabold text-barber-gold">
            {precoFormatado}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{servico.duracaoMinutos} min</span>
          </div>
        </div>
      </div>

      {selected && (
        <div className="absolute top-3 right-3 bg-barber-gold text-black rounded-full p-0.5">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}
    </div>
  );
};
