import axios from 'axios';
import { Usuario, Barbeiro, Servico, Agendamento, AgendamentoRequest } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getServicos = async (): Promise<Servico[]> => {
  const response = await api.get<Servico[]>('/servicos');
  return response.data;
};

export const getBarbeiros = async (): Promise<Barbeiro[]> => {
  const response = await api.get<Barbeiro[]>('/barbeiros');
  return response.data;
};

export const cadastrarCliente = async (dados: { nome: string; email: string; telefone: string }): Promise<Usuario> => {
  const response = await api.post<Usuario>('/usuarios', dados);
  return response.data;
};

export const getDisponibilidade = async (
  barbeiroId: number,
  servicoId: number,
  data: string
): Promise<string[]> => {
  const response = await api.get<string[]>('/agendamentos/disponibilidade', {
    params: { barbeiroId, servicoId, data },
  });
  return response.data;
};

export const criarAgendamento = async (dados: AgendamentoRequest): Promise<Agendamento> => {
  const response = await api.post<Agendamento>('/agendamentos', dados);
  return response.data;
};

export const getAgendamentosCliente = async (clienteId: number): Promise<Agendamento[]> => {
  const response = await api.get<Agendamento[]>(`/agendamentos/cliente/${clienteId}`);
  return response.data;
};

export const getAgendamentosBarbeiro = async (barbeiroId: number, data?: string): Promise<Agendamento[]> => {
  const response = await api.get<Agendamento[]>(`/agendamentos/barbeiro/${barbeiroId}`, {
    params: data ? { data } : {},
  });
  return response.data;
};

export const cancelarAgendamento = async (id: number): Promise<Agendamento> => {
  const response = await api.patch<Agendamento>(`/agendamentos/${id}/cancelar`);
  return response.data;
};

export const concluirAgendamento = async (id: number): Promise<Agendamento> => {
  const response = await api.patch<Agendamento>(`/agendamentos/${id}/concluir`);
  return response.data;
};

export default api;
