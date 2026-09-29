# BarberApp - MVP de Agendamento para Barbearia

> Sistema completo de autoatendimento e agendamento mobile-first para barbearias, desenvolvido em **Java 21 / Spring Boot 3** e **React 18 + Vite + TypeScript + Tailwind CSS**.

Fonte de verdade do projeto: [BarberApp_MVP_Especificacao_v2.docx](file:///c:/Users/gabri/Documents/Projetos/BarberApp/BarberApp_MVP_Especificacao_v2.docx) / [BarberApp_MVP_Especificacao_v2.pdf](file:///c:/Users/gabri/Documents/Projetos/BarberApp/BarberApp_MVP_Especificacao_v2.pdf).

---

## 🚀 Arquitetura e Stack

* **Back-end**: Java 21, Spring Boot 3 (Spring Web, Spring Data JPA, Spring Security com HTTP Basic Auth, Bean Validation, PostgreSQL Driver).
* **Banco de Dados**: PostgreSQL com chaves estrangeiras, índices de data e controle de concorrência com **Lock Pessimista** (`PESSIMISTIC_WRITE`).
* **Front-end**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Axios.
* **Segurança**: HTTP Basic Auth restrito aos endpoints administrativos (`POST /api/barbeiros` e `POST /api/servicos`). Demais rotas públicas.

---

## ⚙️ Variáveis de Configuração (`application.properties`)

```properties
# Conexão Banco de Dados PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/barberapp
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Configurações de Expediente e Slots (Seção 4)
horario.abertura=09:00
horario.fechamento=19:00
slot.duracao.minutos=30
dias.atendimento=SEG,TER,QUA,QUI,SEX,SAB

# Credenciais do Administrador para Basic Auth (Seção 8)
admin.user=admin
admin.pass=admin123
```

---

## 🛠️ Como Executar Localmente

### 1. Banco de Dados (PostgreSQL)
Certifique-se de que o PostgreSQL esteja em execução na porta 5432 e crie a base de dados:
```sql
CREATE DATABASE barberapp;
```
*(Opcional: Execute o seed inicial presente na Seção 12 da especificação ou em `seed.sql`)*.

### 2. Back-end (Spring Boot)
Navegue até a pasta `barberapp-backend` e execute:
```bash
cd barberapp-backend
./mvnw spring-boot:run
```
A API REST estará disponível em: `http://localhost:8080`

### 3. Front-end (React + Vite)
Navegue até a pasta `barberapp-frontend`, instale as dependências e inicie o servidor:
```bash
cd barberapp-frontend
npm install
npm run dev
```
A aplicação web estará acessível em: `http://localhost:5173`

---

## 📋 Documentação e Rastreabilidade

* **Checklist de Etapas**: Consulte o [ROADMAP.md](file:///c:/Users/gabri/Documents/Projetos/BarberApp/ROADMAP.md).
* **Critérios de Validação**: Consulte os 7 casos de teste em [TESTES.md](file:///c:/Users/gabri/Documents/Projetos/BarberApp/TESTES.md).
* **Registro de Decisões Arquiteturais (ADR)**: Template em [docs/adr/0000-template.md](file:///c:/Users/gabri/Documents/Projetos/BarberApp/docs/adr/0000-template.md).
