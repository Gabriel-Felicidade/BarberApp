import React, { useEffect, useState } from 'react';
import { Usuario, Servico, Barbeiro } from '../types';
import { getServicos, getBarbeiros } from '../services/api';
import { Scissors, Calendar, Clock, MapPin, Sparkles, ChevronRight, UserCheck } from 'lucide-react';

interface HomeProps {
  cliente: Usuario | null;
  onStartAgendamento: (servico?: Servico) => void;
}

export const Home: React.FC<HomeProps> = ({ cliente, onStartAgendamento }) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [listaServicos, listaBarbeiros] = await Promise.all([
          getServicos(),
          getBarbeiros(),
        ]);
        setServicos(listaServicos);
        setBarbeiros(listaBarbeiros);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  return (
    <div className="space-y-6 pb-20 max-w-md mx-auto px-4 pt-6">
      {/* Header com saudação */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-barber-gold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Barbearia Premium
          </span>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-0.5">
            Olá, {cliente ? cliente.nome.split(' ')[0] : 'Visitante'}!
          </h1>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-barber-card border border-barber-border flex items-center justify-center text-barber-gold font-bold">
          {cliente ? (
            cliente.nome.charAt(0).toUpperCase()
          ) : (
            <Scissors className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* Hero Banner com Botão Rápido de Agendar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/60 via-barber-card to-barber-dark border border-barber-gold/30 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-barber-gold/20 text-barber-gold text-xs font-bold mb-3 border border-barber-gold/30">
            <Clock className="w-3 h-3" />
            Seg - Sáb: 09:00 às 19:00
          </div>
          <h2 className="text-xl font-black text-slate-100 leading-snug">
            Corte com estilo e sem filas de espera.
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 mb-5 max-w-[240px]">
            Escolha seu serviço, o barbeiro de preferência e agende em menos de 1 minuto.
          </p>
          <button
            onClick={() => onStartAgendamento()}
            className="w-full bg-barber-gold hover:bg-barber-goldHover text-black font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(229,169,60,0.3)] transition-all active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" />
            <span>Agendar Meu Horário</span>
            <ChevronRight className="w-4 h-4 ml-auto stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Catálogo de Serviços */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-barber-gold" />
            Serviços Disponíveis
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {servicos.length} opções
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-barber-card/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {servicos.map((servico) => (
              <div
                key={servico.id}
                onClick={() => onStartAgendamento(servico)}
                className="p-4 rounded-2xl bg-barber-card/90 border border-barber-border hover:border-barber-gold/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-100">{servico.nome}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{servico.descricao}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-barber-gold" />
                      {servico.duracaoMinutos} min
                    </span>
                  </div>
                </div>

                <div className="text-right pl-3 shrink-0">
                  <span className="text-sm font-extrabold text-barber-gold block">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.preco)}
                  </span>
                  <span className="text-[10px] text-slate-400 underline decoration-barber-gold/50">
                    Selecionar
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nossos Barbeiros */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-barber-gold" />
            Profissionais
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {barbeiros.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-barber-card/80 border border-barber-border text-center space-y-2"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-barber-elevated border border-barber-gold/40 flex items-center justify-center font-bold text-barber-gold">
                {b.nome.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-100">{b.nome}</h4>
                <p className="text-[11px] text-barber-gold truncate">{b.especialidade}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Localização / Informações */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 text-xs text-slate-400">
        <MapPin className="w-5 h-5 text-barber-gold shrink-0" />
        <div>
          <span className="font-semibold text-slate-200 block">BarberApp Studio</span>
          <span>Atendimento presencial com hora marcada</span>
        </div>
      </div>
    </div>
  );
};
