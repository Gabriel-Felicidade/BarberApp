export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'CLIENTE' | 'BARBEIRO' | 'ADMIN';
}

export interface Barbeiro {
  id: number;
  usuarioId?: number;
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  ativo: boolean;
}

export interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos: number;
}

export interface Agendamento {
  id: number;
  clienteId: number;
  clienteNome?: string;
  clienteTelefone?: string;
  barbeiroId: number;
  barbeiroNome?: string;
  especialidade?: string;
  servicoId: number;
  servicoNome?: string;
  preco?: number;
  duracaoMinutos?: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
}

export interface AgendamentoRequest {
  clienteId: number;
  barbeiroId: number;
  servicoId: number;
  dataHoraInicio: string;
}

export interface ApiErrorResponse {
  mensagem: string;
  codigo: string;
  timestamp: string;
}
