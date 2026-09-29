import React, { useState } from 'react';
import { Usuario } from '../types';
import { cadastrarCliente } from '../services/api';
import { User, Mail, Phone, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface CadastroClienteProps {
  onClienteCadastrado: (usuario: Usuario) => void;
  clienteAtual?: Usuario | null;
}

export const CadastroCliente: React.FC<CadastroClienteProps> = ({
  onClienteCadastrado,
  clienteAtual,
}) => {
  const [nome, setNome] = useState(clienteAtual?.nome || '');
  const [email, setEmail] = useState(clienteAtual?.email || '');
  const [telefone, setTelefone] = useState(clienteAtual?.telefone || '');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      setErro(null);
      const usuario = await cadastrarCliente({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
      });
      onClienteCadastrado(usuario);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.mensagem || 'Erro ao realizar cadastro. Tente novamente.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-barber-elevated border border-barber-gold/30 text-barber-gold mb-4 shadow-[0_0_25px_rgba(229,169,60,0.15)]">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          {clienteAtual ? 'Editar Dados do Perfil' : 'Bem-vindo ao BarberApp'}
        </h1>
        <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
          {clienteAtual
            ? 'Atualize suas informações de contato para os agendamentos.'
            : 'Informe seus dados de contato apenas uma vez para agilizar todos os seus agendamentos.'}
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {erro}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-barber-gold" />
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Gabriel Silva"
              className="w-full bg-barber-dark/80 border border-barber-border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-barber-gold focus:ring-1 focus:ring-barber-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-barber-gold" />
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: gabriel@email.com"
              className="w-full bg-barber-dark/80 border border-barber-border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-barber-gold focus:ring-1 focus:ring-barber-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-barber-gold" />
              Telefone / WhatsApp
            </label>
            <input
              type="tel"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Ex: (11) 98765-4321"
              className="w-full bg-barber-dark/80 border border-barber-border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-barber-gold focus:ring-1 focus:ring-barber-gold transition-colors"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-barber-gold hover:bg-barber-goldHover text-black font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(229,169,60,0.25)] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{clienteAtual ? 'Salvar Alterações' : 'Continuar para Agendamento'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Seus dados são salvos com segurança para suas reservas.</span>
        </div>
      </div>
    </div>
  );
};
