import React, { useEffect, useState } from 'react';
import { Usuario, Servico, Barbeiro, Agendamento } from '../types';
import { getServicos, getBarbeiros, getDisponibilidade, criarAgendamento } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { BarberCard } from '../components/BarberCard';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  AlertTriangle,
  CalendarCheck,
} from 'lucide-react';

interface AgendamentoFlowProps {
  cliente: Usuario;
  initialServico?: Servico | null;
  onAgendamentoConcluido: () => void;
  onVoltarParaHome: () => void;
}

export const AgendamentoFlow: React.FC<AgendamentoFlowProps> = ({
  cliente,
  initialServico = null,
  onAgendamentoConcluido,
  onVoltarParaHome,
}) => {
  // Wizard steps: 1: Serviço, 2: Barbeiro, 3: Data & Hora, 4: Confirmação
  const [step, setStep] = useState<number>(initialServico ? 2 : 1);

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [loadingListas, setLoadingListas] = useState<boolean>(true);

  // Seleções do fluxo
  const [selectedServico, setSelectedServico] = useState<Servico | null>(initialServico);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<Barbeiro | null>(null);

  // Data padrão: hoje formatado em YYYY-MM-DD
  const hojeStr = new Date().toISOString().split('T')[0];
  const [selectedData, setSelectedData] = useState<string>(hojeStr);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Disponibilidade da API
  const [slotsDisponiveis, setSlotsDisponiveis] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Estado de envio e resultado
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  const [agendamentoCriado, setAgendamentoCriado] = useState<Agendamento | null>(null);

  // Carrega lista de serviços e barbeiros
  useEffect(() => {
    const carregarListas = async () => {
      try {
        setLoadingListas(true);
        const [listaServicos, listaBarbeiros] = await Promise.all([
          getServicos(),
          getBarbeiros(),
        ]);
        setServicos(listaServicos);
        setBarbeiros(listaBarbeiros);
      } catch (err) {
        console.error('Erro ao buscar serviços/barbeiros:', err);
        setErro('Não foi possível carregar os serviços e profissionais.');
      } finally {
        setLoadingListas(false);
      }
    };
    carregarListas();
  }, []);

  // Busca slots de horários livres quando estiver no passo 3 ou mudar barbeiro/serviço/data
  useEffect(() => {
    if (step === 3 && selectedBarbeiro && selectedServico && selectedData) {
      const carregarSlots = async () => {
        try {
          setLoadingSlots(true);
          setErro(null);
          const slots = await getDisponibilidade(
            selectedBarbeiro.id,
            selectedServico.id,
            selectedData
          );
          setSlotsDisponiveis(slots);
          // Se o slot previamente selecionado não estiver mais livre, reseta
          if (selectedSlot && !slots.includes(selectedSlot)) {
            setSelectedSlot(null);
          }
        } catch (err: any) {
          console.error('Erro ao carregar horários disponíveis:', err);
          const msg = err.response?.data?.mensagem || 'Erro ao consultar horários disponíveis.';
          setErro(msg);
          setSlotsDisponiveis([]);
        } finally {
          setLoadingSlots(false);
        }
      };
      carregarSlots();
    }
  }, [step, selectedBarbeiro, selectedServico, selectedData]);

  // Finalização do Agendamento (POST /api/agendamentos)
  const handleConfirmarAgendamento = async () => {
    if (!selectedBarbeiro || !selectedServico || !selectedData || !selectedSlot) {
      setErro('Por favor, certifique-se de que todos os dados foram selecionados.');
      return;
    }

    try {
      setSubmitting(true);
      setErro(null);

      // Constrói dataHoraInicio no formato ISO: "YYYY-MM-DDTHH:mm:00"
      const dataHoraInicio = `${selectedData}T${selectedSlot}:00`;

      const novoAgendamento = await criarAgendamento({
        clienteId: cliente.id,
        barbeiroId: selectedBarbeiro.id,
        servicoId: selectedServico.id,
        dataHoraInicio,
      });

      setAgendamentoCriado(novoAgendamento);
    } catch (err: any) {
      console.error('Erro ao criar agendamento:', err);
      // Trata erro 409 (Conflito de Horário) com o shape JSON padrão da Seção 7
      const msg =
        err.response?.data?.mensagem ||
        'Não foi possível confirmar o agendamento. O horário pode ter sido reservado por outro cliente.';
      setErro(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Tela de Sucesso após conclusão
  if (agendamentoCriado) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 max-w-md mx-auto text-center py-8">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Agendamento Confirmado!
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-xs">
          Sua reserva foi realizada com sucesso. Te esperamos na barbearia!
        </p>

        {/* Card Resumo do Agendamento */}
        <div className="glass-panel w-full p-5 rounded-3xl mt-6 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-barber-border">
            <span className="text-xs text-slate-400">Serviço</span>
            <span className="text-sm font-bold text-slate-100">{selectedServico?.nome}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-barber-border">
            <span className="text-xs text-slate-400">Barbeiro</span>
            <span className="text-sm font-bold text-barber-gold">{selectedBarbeiro?.nome}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-barber-border">
            <span className="text-xs text-slate-400">Data</span>
            <span className="text-sm font-bold text-slate-100">
              {new Date(selectedData + 'T00:00:00').toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Horário</span>
            <span className="text-base font-black text-barber-gold">{selectedSlot}</span>
          </div>
        </div>

        <div className="w-full space-y-3 mt-8">
          <button
            onClick={onAgendamentoConcluido}
            className="w-full bg-barber-gold hover:bg-barber-goldHover text-black font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(229,169,60,0.25)] transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Ver Minhas Reservas</span>
          </button>
          <button
            onClick={onVoltarParaHome}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-md mx-auto px-4 pt-4">
      {/* Header do Wizard com Progresso */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (step > 1) {
                setStep(step - 1);
                setErro(null);
              } else {
                onVoltarParaHome();
              }
            }}
            className="p-2 rounded-xl bg-barber-card border border-barber-border text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <span className="text-[11px] font-bold text-barber-gold uppercase tracking-wider">
              Etapa {step} de 4
            </span>
            <h2 className="text-sm font-bold text-slate-100">
              {step === 1 && 'Escolha o Serviço'}
              {step === 2 && 'Escolha o Barbeiro'}
              {step === 3 && 'Data e Horário'}
              {step === 4 && 'Revisão e Confirmação'}
            </h2>
          </div>
          <div className="w-8" />
        </div>

        {/* Barra de Progresso visual */}
        <div className="w-full grid grid-cols-4 gap-1.5 h-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i <= step ? 'bg-barber-gold' : 'bg-barber-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Alerta de Erro / Conflito */}
      {erro && (
        <div className="p-4 bg-red-950/70 border border-red-500/50 rounded-2xl text-red-200 text-xs flex items-start gap-3 shadow-lg animate-shake">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-red-300">Atenção</p>
            <p>{erro}</p>
          </div>
        </div>
      )}

      {/* PASSO 1: Seleção de Serviço */}
      {step === 1 && (
        <div className="space-y-3">
          {loadingListas ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-barber-card/60 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {servicos.map((servico) => (
                <ServiceCard
                  key={servico.id}
                  servico={servico}
                  selected={selectedServico?.id === servico.id}
                  onSelect={(s) => {
                    setSelectedServico(s);
                    setErro(null);
                    setStep(2);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PASSO 2: Seleção de Barbeiro */}
      {step === 2 && (
        <div className="space-y-3">
          <div className="space-y-2.5">
            {barbeiros.map((barbeiro) => (
              <BarberCard
                key={barbeiro.id}
                barbeiro={barbeiro}
                selected={selectedBarbeiro?.id === barbeiro.id}
                onSelect={(b: Barbeiro) => {
                  setSelectedBarbeiro(b);
                  setErro(null);
                  setStep(3);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* PASSO 3: Seleção de Data e Horário */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Seletor de Data */}
          <div className="glass-panel p-4 rounded-2xl space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-barber-gold" />
              Selecione o Dia
            </label>
            <input
              type="date"
              min={hojeStr}
              value={selectedData}
              onChange={(e) => {
                setSelectedData(e.target.value);
                setSelectedSlot(null);
                setErro(null);
              }}
              className="w-full bg-barber-dark/90 border border-barber-border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-barber-gold focus:ring-1 focus:ring-barber-gold transition-colors"
            />
          </div>

          {/* Componente TimeSlotPicker */}
          <div className="glass-panel p-4 rounded-2xl">
            <TimeSlotPicker
              slots={slotsDisponiveis}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
                setErro(null);
              }}
              loading={loadingSlots}
            />
          </div>

          {/* Botão para Avançar para Confirmação */}
          <button
            disabled={!selectedSlot}
            onClick={() => setStep(4)}
            className="w-full bg-barber-gold hover:bg-barber-goldHover text-black font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(229,169,60,0.25)] transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Avançar para Confirmação</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}

      {/* PASSO 4: Resumo e Confirmação */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="glass-panel p-5 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-barber-border">
              <CalendarCheck className="w-4 h-4 text-barber-gold" />
              Resumo do Agendamento
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-barber-gold" />
                  Cliente
                </span>
                <span className="font-bold text-slate-100">{cliente.nome}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-barber-gold" />
                  Serviço
                </span>
                <span className="font-bold text-slate-100">{selectedServico?.nome}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-barber-gold" />
                  Duração
                </span>
                <span className="font-bold text-slate-100">
                  {selectedServico?.duracaoMinutos} minutos
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-barber-gold" />
                  Barbeiro
                </span>
                <span className="font-bold text-barber-gold">{selectedBarbeiro?.nome}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-barber-gold" />
                  Data
                </span>
                <span className="font-bold text-slate-100">
                  {new Date(selectedData + 'T00:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-barber-gold" />
                  Horário de Início
                </span>
                <span className="text-sm font-black text-barber-gold">{selectedSlot}</span>
              </div>

              <div className="pt-3 border-t border-barber-border flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200">Total a Pagar</span>
                <span className="text-lg font-black text-barber-gold">
                  {selectedServico?.preco &&
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      selectedServico.preco
                    )}
                </span>
              </div>
            </div>
          </div>

          <button
            disabled={submitting}
            onClick={handleConfirmarAgendamento}
            className="w-full bg-barber-gold hover:bg-barber-goldHover text-black font-extrabold py-4 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_0_25px_rgba(229,169,60,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? (
              <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Confirmar Agendamento</span>
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
