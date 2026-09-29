# BarberApp - Casos de Teste e Critérios de Aceite (MVP)

Documento baseado na **Seção 13** da Especificação Técnica ([BarberApp_MVP_Especificacao_v2.docx](file:///c:/Users/gabri/Documents/Projetos/BarberApp/BarberApp_MVP_Especificacao_v2.docx) / [PDF](file:///c:/Users/gabri/Documents/Projetos/BarberApp/BarberApp_MVP_Especificacao_v2.pdf)).

---

### Caso de Teste 1: Filtragem e Cálculo Dinâmico de Horários Disponíveis (Geração de Slots)
* **Dado** que um cliente selecionou um serviço com duração de 60 minutos (ex: `servicoId=2`) e um barbeiro com agendamento ativo das 14:00 às 15:00 na data informada,
* **Quando** o cliente consulta a disponibilidade via `GET /api/agendamentos/disponibilidade?barbeiroId=1&servicoId=2&data=2026-09-15`,
* **Então** a API retorna status `200 OK` e uma lista de horários onde os slots que colidem com o intervalo das 14:00 às 15:00 (ou slots após 18:00 que ultrapassariam o fechamento às 19:00) NÃO estão presentes / são desabilitados no front-end.

---

### Caso de Teste 2: Rejeição de Conflito de Horário e Concorrência Serializada (Lock Pessimista)
* **Dado** que o barbeiro `barbeiroId=2` já possui um agendamento com status `AGENDADO` das 14:00 às 14:30 no dia 2026-09-15,
* **Quando** duas requisições simultâneas tentarem agendar para o mesmo barbeiro no intervalo colidente (`POST /api/agendamentos` com `dataHoraInicio: 2026-09-15T14:00:00`),
* **Então** a primeira requisição obtém lock e retorna `201 Created`, enquanto a segunda requisição é rejeitada com status `409 Conflict` e corpo JSON padronizado contendo `codigo: "CONFLITO_HORARIO"` e `mensagem: "Horário indisponível para este barbeiro."`.

---

### Caso de Teste 3: Proteção de Rotas Administrativas com HTTP Basic Auth
* **Dado** que as rotas de criação de barbeiros e serviços são restritas a administradores (Seção 8),
* **Quando** uma requisição `POST /api/barbeiros` ou `POST /api/servicos` for enviada sem credenciais HTTP Basic Auth ou com credenciais inválidas,
* **Então** a API responde imediatamente com status `401 Unauthorized`.
* **E Quando** for enviada com o cabeçalho `Authorization: Basic <base64(admin:admin123)>`, a API responde com status `201 Created`.

---

### Caso de Teste 4: Autoatendimento e Cadastro Simplificado do Cliente
* **Dado** que um novo cliente acessa a plataforma pela primeira vez e preenche nome, email e telefone,
* **Quando** o front-end envia `POST /api/usuarios` com `{ "nome": "Gabriel Silva", "email": "gabriel@email.com", "telefone": "11987654321" }`,
* **Então** a API cria o usuário com perfil `CLIENTE`, retorna status `201 Created` contendo o `{ "id": X, ... }`, e o front-end utiliza este `clienteId` automaticamente para confirmar os agendamentos sem necessidade de login complexo ou intervenção manual no banco.

---

### Caso de Teste 5: Consulta da Agenda Cronológica Diária do Barbeiro
* **Dado** que existem agendamentos cadastrados para o barbeiro `barbeiroId=1` no dia `2026-09-15`,
* **Quando** for requisitado `GET /api/agendamentos/barbeiro/1?data=2026-09-15`,
* **Então** a API retorna status `200 OK` com a lista dos agendamentos do dia ordenados cronologicamente por `dataHoraInicio`, exibindo cliente, serviço, duração e status.

---

### Caso de Teste 6: Usabilidade e Responsividade Mobile-First
* **Dado** que a aplicação web é visualizada em dispositivos com resoluções de tela entre 375px e 430px (smartphones comuns),
* **Quando** o usuário navega entre a Home, Catálogo de Serviços, Wizard de Agendamento e Meus Agendamentos,
* **Então** todos os componentes são renderizados sem barra de rolagem horizontal, com barra inferior de navegação (`BottomNav`) fixa e botões ergonômicos com feedback de toque.

---

### Caso de Teste 7: Cancelamento de Agendamento e Liberação Imediata de Slot
* **Dado** que um agendamento com status `AGENDADO` ocupa o horário das 10:00 às 10:30 do dia `2026-09-15`,
* **Quando** o cliente ou admin executa `PATCH /api/agendamentos/{id}/cancelar`,
* **Então** o status do agendamento é alterado para `CANCELADO`, a API responde `200 OK`, e uma chamada subsequente a `GET /api/agendamentos/disponibilidade` passa a exibir o slot das 10:00 como imediatamente disponível.
