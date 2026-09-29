import React from 'react';
import { Home, CalendarPlus, CalendarCheck, User } from 'lucide-react';

export type TabType = 'home' | 'agendar' | 'meus-agendamentos' | 'perfil';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  agendamentosCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  agendamentosCount = 0,
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Início', icon: Home },
    { id: 'agendar' as TabType, label: 'Agendar', icon: CalendarPlus },
    {
      id: 'meus-agendamentos' as TabType,
      label: 'Reservas',
      icon: CalendarCheck,
      badge: agendamentosCount > 0 ? agendamentosCount : undefined,
    },
    { id: 'perfil' as TabType, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-barber-border">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all duration-200 ${
                isActive
                  ? 'text-barber-gold font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-barber-gold text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#0F1115]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-barber-gold rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
