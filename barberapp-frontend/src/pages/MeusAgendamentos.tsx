import React, { useEffect, useState } from 'react';
import { Usuario, Agendamento, Barbeiro } from '../types';
import {
  getAgendamentosCliente,
  getAgendamentosBarbeiro,
  cancelarAgendamento,
  concluirAgendamento,
  getBarbeiros,
} from '../services/api';
import {
  Calendar,
  Clock,
  User,
  XCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface MeusAgendamentosProps {
  cliente: Usuario;
  onNovoAgendamento: () => void;
}

export const MeusAgendamentos: React.FC<MeusAgendamentosProps> = ({
  cliente,
  onNovoAgendamento,
}) => {
  const [viewMode, setViewMode] = useState<'cliente' | 'barbeiro'>('cliente');
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(
    null
  );

  // Estados para visualização da agenda do barbeiro
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [selectedBarbeiroId, setSelectedBarbeiroId] = useState<number>(1);
  const hojeStr = new Date().toISOString().split('T')[0];
  const [dataAgenda, setDataAgenda] = useState<string>(hojeStr);

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      setMensagem(null);
      if (viewMode === 'cliente') {
        const lista = await getAgendamentosCliente(cliente.id);
        setAgendamentos(lista);
      } else {
        const [lista, listaBarbeiros] = await Promise.all([
          getAgendamentosBarbeiro(selectedBarbeiroId, dataAgenda),
          getBarbeiros(),
        ]);
        setAgendamentos(lista);
        setBarbeiros(listaBarbeiros);
        if (listaBarbeiros.length > 0 && !selectedBarbeiroId) {
          setSelectedBarbeiroId(listaBarbeiros[0].id);
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar agendamentos:', err);
      setMensagem({
        tipo: 'erro',
        texto: err.response?.data?.mensagem || 'Erro ao carregar lista de agendamentos.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [viewMode, selectedBarbeiroId, dataAgenda]);

  const handleCancelar = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    try {
      setActionLoadingId(id);
      await cancelarAgendamento(id);
      setMensagem({ tipo: 'sucesso', texto: 'Agendamento cancelado com sucesso!' });
      await carregarAgendamentos();
    } catch (err: any) {
      console.error('Erro ao cancelar agendamento:', err);
      setMensagem({
        tipo: 'erro',
        texto: err.response?.data?.mensagem || 'Erro ao cancelar agendamento.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConcluir = async (id: number) => {
    try {
      setActionLoadingId(id);
      await concluirAgendamento(id);
      setMensagem({ tipo: 'sucesso', texto: 'Agendamento marcado como concluído!' });
      await carregarAgendamentos();
    } catch (err: any) {
      console.error('Erro ao concluir agendamento:', err);
      setMensagem({
        tipo: 'erro',
        texto: err.response?.data?.mensagem || 'Erro ao concluir agendamento.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatarData = (dataIso: string) => {
    const d = new Date(dataIso);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const formatarHora = (dataIso: string) => {
    const d = new Date(dataIso);
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-5 pb-24 max-w-md mx-auto px-4 pt-4">
      {/* Alternador de Visão (Cliente vs Agenda do Barbeiro) */}
      <div className="p-1 bg-barber-card/80 border border-barber-border rounded-2xl flex">
        <button
          onClick={() => setViewMode('cliente')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'cliente'
              ? 'bg-barber-gold text-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Minhas Reservas
        </button>
        <button
          onClick={() => setViewMode('barbeiro')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'barbeiro'
              ? 'bg-barber-gold text-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Agenda do Barbeiro
        </button>
      </div>

      {/* Controles de Filtro para Visão de Barbeiro */}
      {viewMode === 'barbeiro' && (
        <div className="glass-panel p-4 rounded-2xl space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Profissional
              </label>
              <select
                value={selectedBarbeiroId}
                onChange={(e) => setSelectedBarbeiroId(Number(e.target.value))}
                className="w-full bg-barber-dark border border-barber-border rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-barber-gold"
              >
                {barbeiros.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Data da Agenda
              </label>
              <input
                type="date"
                value={dataAgenda}
                onChange={(e) => setDataAgenda(e.target.value)}
                className="w-full bg-barber-dark border border-barber-border rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-barber-gold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mensagens de Feedback */}
      {mensagem && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
            mensagem.tipo === 'sucesso'
              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/70 border border-red-500/50 text-red-200'
          }`}
        >
          {mensagem.tipo === 'sucesso' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* Lista de Agendamentos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-barber-gold" />
            {viewMode === 'cliente' ? 'Histórico e Agendamentos' : 'Agenda do Dia'}
          </h2>
          <button
            onClick={carregarAgendamentos}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-barber-gold hover:bg-barber-elevated transition-colors"
            title="Recarregar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-barber-card/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : agendamentos.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-200">
              {viewMode === 'cliente'
                ? 'Você ainda não possui agendamentos.'
                : 'Nenhum agendamento para este barbeiro nesta data.'}
            </p>
            {viewMode === 'cliente' && (
              <button
                onClick={onNovoAgendamento}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-barber-gold text-black text-xs font-bold shadow-md hover:bg-barber-goldHover transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Fazer meu primeiro agendamento</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {agendamentos.map((agendamento) => {
              const isAgendado = agendamento.status === 'AGENDADO';
              const isConcluido = agendamento.status === 'CONCLUIDO';

              return (
                <div
                  key={agendamento.id}
                  className="glass-panel p-4 rounded-2xl border border-barber-border space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-barber-border">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-100">
                        {agendamento.servicoNome || 'Serviço'}
                      </span>
                    </div>

                    {/* Badge de Status */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        isAgendado
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isConcluido
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {agendamento.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-barber-gold" />
                      <span className="truncate">
                        {viewMode === 'cliente'
                          ? `Barbeiro: ${agendamento.barbeiroNome || 'João'}`
                          : `Cliente: ${agendamento.clienteNome || 'Cliente'}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 justify-end">
                      <Calendar className="w-3.5 h-3.5 text-barber-gold" />
                      <span>{formatarData(agendamento.dataHoraInicio)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-barber-gold" />
                      <span className="font-bold text-slate-100">
                        {formatarHora(agendamento.dataHoraInicio)} -{' '}
                        {formatarHora(agendamento.dataHoraFim)}
                      </span>
                    </div>

                    {agendamento.preco !== undefined && (
                      <div className="text-right font-extrabold text-barber-gold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(agendamento.preco)}
                      </div>
                    )}
                  </div>

                  {/* Ações disponíveis se o status for AGENDADO */}
                  {isAgendado && (
                    <div className="pt-2 border-t border-barber-border/60 flex items-center justify-end gap-2">
                      {viewMode === 'barbeiro' && (
                        <button
                          onClick={() => handleConcluir(agendamento.id)}
                          disabled={actionLoadingId === agendamento.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Concluir</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCancelar(agendamento.id)}
                        disabled={actionLoadingId === agendamento.id}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancelar Reserva</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
