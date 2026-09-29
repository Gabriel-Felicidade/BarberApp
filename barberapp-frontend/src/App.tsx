import React, { useState, useEffect } from 'react';
import { Usuario, Servico } from './types';
import { BottomNav, TabType } from './components/BottomNav';
import { Home } from './pages/Home';
import { CadastroCliente } from './pages/CadastroCliente';
import { AgendamentoFlow } from './pages/AgendamentoFlow';
import { MeusAgendamentos } from './pages/MeusAgendamentos';
import { getAgendamentosCliente } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [cliente, setCliente] = useState<Usuario | null>(null);
  const [initialServico, setInitialServico] = useState<Servico | null>(null);
  const [agendamentosCount, setAgendamentosCount] = useState<number>(0);

  // Inicializa o cliente a partir do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('barberapp_cliente');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCliente(parsed);
      } catch (e) {
        console.error('Erro ao ler cliente salvo no localStorage:', e);
      }
    }
  }, []);

  // Atualiza contador de agendamentos ativos
  useEffect(() => {
    if (cliente?.id) {
      getAgendamentosCliente(cliente.id)
        .then((list) => {
          const ativos = list.filter((a) => a.status === 'AGENDADO').length;
          setAgendamentosCount(ativos);
        })
        .catch(() => {});
    }
  }, [cliente, activeTab]);

  const handleClienteCadastrado = (usuarioCadastrado: Usuario) => {
    setCliente(usuarioCadastrado);
    localStorage.setItem('barberapp_cliente', JSON.stringify(usuarioCadastrado));
    setActiveTab('agendar');
  };

  const handleStartAgendamento = (servico?: Servico) => {
    setInitialServico(servico || null);
    if (!cliente) {
      setActiveTab('perfil');
    } else {
      setActiveTab('agendar');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-100 flex flex-col items-center justify-start selection:bg-barber-gold selection:text-black">
      {/* Container Principal Mobile-First */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#0F1115] relative shadow-2xl">
        {/* Conteúdo Dinâmico por Aba */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <Home
              cliente={cliente}
              onStartAgendamento={handleStartAgendamento}
            />
          )}

          {activeTab === 'agendar' && (
            cliente ? (
              <AgendamentoFlow
                cliente={cliente}
                initialServico={initialServico}
                onAgendamentoConcluido={() => setActiveTab('meus-agendamentos')}
                onVoltarParaHome={() => setActiveTab('home')}
              />
            ) : (
              <CadastroCliente
                onClienteCadastrado={handleClienteCadastrado}
                clienteAtual={cliente}
              />
            )
          )}

          {activeTab === 'meus-agendamentos' && (
            cliente ? (
              <MeusAgendamentos
                cliente={cliente}
                onNovoAgendamento={() => handleStartAgendamento()}
              />
            ) : (
              <CadastroCliente
                onClienteCadastrado={handleClienteCadastrado}
                clienteAtual={cliente}
              />
            )
          )}

          {activeTab === 'perfil' && (
            <CadastroCliente
              onClienteCadastrado={handleClienteCadastrado}
              clienteAtual={cliente}
            />
          )}
        </main>

        {/* Navegação Inferior Fixa */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
          }}
          agendamentosCount={agendamentosCount}
        />
      </div>
    </div>
  );
};

export default App;
