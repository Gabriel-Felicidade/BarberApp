# BarberApp - Roadmap de Execução (MVP)

Checklist de acompanhamento das etapas de desenvolvimento descritas na Seção 11 da Especificação Técnica ([BarberApp_MVP_Especificacao_v2.docx](file:///c:/Users/gabri/Documents/Projetos/BarberApp/BarberApp_MVP_Especificacao_v2.docx) / [PDF](file:///c:/Users/gabri/Documents/Projetos/BarberApp/BarberApp_MVP_Especificacao_v2.pdf)):

- [ ] **Etapa 1** - Bootstrap & Configuração: Criar o projeto Spring Boot, configurar `application.properties` (conexão PostgreSQL + constantes de expediente da Seção 4).
- [ ] **Etapa 2** - Entidades e Repositórios: Implementar `Usuario`, `Barbeiro`, `Servico` e `Agendamento` com anotações JPA. Criar as interfaces `JpaRepository` equivalentes.
- [ ] **Etapa 3** - Service de Conflito de Horário: Implementar `AgendamentoService` com cálculo de `dataHoraFim`, geração de slots (Seção 4) e checagem de disponibilidade com lock pessimista (Seção 5).
- [ ] **Etapa 4** - Camada Web (Controllers & DTOs): Criar todos os endpoints da Seção 6, incluindo os de administração, com DTOs (`records`) e o `@ControllerAdvice` de erro (Seção 7).
- [ ] **Etapa 5** - Segurança: Configurar Spring Security com HTTP Basic Auth apenas nas rotas de administração `POST /api/barbeiros` e `POST /api/servicos` (Seção 8).
- [ ] **Etapa 6** - Front-end Mobile-First: Inicializar o projeto React com Vite, TypeScript, Tailwind CSS e Lucide Icons. Construir cards de serviços, barra inferior fixa (`BottomNav`), wizard de agendamento e tela de cadastro de cliente (Seção 9 e 10).
- [ ] **Etapa 7** - Integração, Teste Ponta a Ponta e Seed SQL: Conectar via Axios, rodar script de Seed (Seção 12), efetuar agendamentos reais e validar todos os critérios de aceite (Seção 13).
