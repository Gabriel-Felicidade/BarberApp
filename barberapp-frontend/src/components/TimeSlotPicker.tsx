import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  loading?: boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2.5 py-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-barber-card/60 animate-pulse rounded-xl border border-barber-border/60"
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-barber-card/40 rounded-2xl border border-barber-border text-center">
        <AlertCircle className="w-8 h-8 text-barber-muted mb-2" />
        <p className="text-sm font-medium text-slate-300">
          Nenhum horário disponível
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Tente selecionar outra data ou outro profissional.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
        <Clock className="w-3.5 h-3.5 text-barber-gold" />
        <span>Horários livres ({slots.length} disponíveis)</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-150 flex items-center justify-center border ${
                isSelected
                  ? 'bg-barber-gold text-black border-barber-gold shadow-[0_0_15px_rgba(229,169,60,0.3)] scale-[1.02]'
                  : 'bg-barber-card/90 text-slate-200 border-barber-border hover:border-barber-gold/50 hover:bg-barber-elevated'
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};
