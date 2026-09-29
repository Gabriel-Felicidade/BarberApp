package com.barberapp;

import com.barberapp.dto.AgendamentoRequest;
import com.barberapp.dto.BarbeiroRequest;
import com.barberapp.dto.ServicoRequest;
import com.barberapp.dto.UsuarioRequest;
import com.barberapp.model.Agendamento;
import com.barberapp.model.Barbeiro;
import com.barberapp.model.Servico;
import com.barberapp.model.Usuario;
import com.barberapp.repository.AgendamentoRepository;
import com.barberapp.repository.BarbeiroRepository;
import com.barberapp.repository.ServicoRepository;
import com.barberapp.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AgendamentoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    private Usuario cliente;
    private Usuario usuarioBarbeiro;
    private Barbeiro barbeiro;
    private Servico servicoCabelo;
    private Servico servicoBarba;

    @BeforeEach
    void setUp() {
        agendamentoRepository.deleteAll();
        barbeiroRepository.deleteAll();
        usuarioRepository.deleteAll();
        servicoRepository.deleteAll();

        // Cria usuário cliente
        cliente = usuarioRepository.save(new Usuario(null, "Carlos Cliente", "carlos@teste.com", "11988887777", "CLIENTE"));

        // Cria usuário e entidade barbeiro
        usuarioBarbeiro = usuarioRepository.save(new Usuario(null, "João Barbeiro", "joao@barberapp.com", "11999990001", "BARBEIRO"));
        barbeiro = barbeiroRepository.save(new Barbeiro(null, usuarioBarbeiro, "Corte e Barba", true));

        // Cria serviços
        servicoCabelo = servicoRepository.save(new Servico(null, "Corte Simples", "Corte na tesoura", new BigDecimal("40.00"), 30));
        servicoBarba = servicoRepository.save(new Servico(null, "Corte + Barba", "Corte e barba", new BigDecimal("65.00"), 60));
    }

    @Test
    @DisplayName("Deve cadastrar cliente via POST /api/usuarios e retornar 201 Created")
    void deveCadastrarCliente() throws Exception {
        UsuarioRequest request = new UsuarioRequest("Gabriel Silva", "gabriel@teste.com", "11977776666", "CLIENTE");

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.nome", is("Gabriel Silva")))
                .andExpect(jsonPath("$.email", is("gabriel@teste.com")));
    }

    @Test
    @DisplayName("Deve bloquear POST /api/barbeiros sem Basic Auth com 401 Unauthorized")
    void deveBloquearCadastroBarbeiroSemAuth() throws Exception {
        BarbeiroRequest request = new BarbeiroRequest(usuarioBarbeiro.getId(), "Degradê", true);

        mockMvc.perform(post("/api/barbeiros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Deve permitir POST /api/barbeiros com Basic Auth Admin e retornar 201 Created")
    void devePermitirCadastroBarbeiroComAuth() throws Exception {
        Usuario novoUser = usuarioRepository.save(new Usuario(null, "Novo Barbeiro", "novo@barber.com", "11911112222", "BARBEIRO"));
        BarbeiroRequest request = new BarbeiroRequest(novoUser.getId(), "Degradê Especial", true);

        mockMvc.perform(post("/api/barbeiros")
                        .with(httpBasic("admin", "admin123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.especialidade", is("Degradê Especial")));
    }

    @Test
    @DisplayName("Deve bloquear POST /api/servicos sem Basic Auth com 401 Unauthorized")
    void deveBloquearCadastroServicoSemAuth() throws Exception {
        ServicoRequest request = new ServicoRequest("Navalhado", "Corte navalhado", new BigDecimal("50.00"), 30);

        mockMvc.perform(post("/api/servicos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Deve listar horários disponíveis calculando slots livres corretamente")
    void deveListarHorariosDisponiveis() throws Exception {
        // Próxima terça-feira (dia útil de atendimento)
        LocalDate proximaTerca = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.TUESDAY));

        // Cria agendamento das 10:00 às 10:30
        LocalDateTime inicioAgendado = LocalDateTime.of(proximaTerca, java.time.LocalTime.of(10, 0));
        LocalDateTime fimAgendado = inicioAgendado.plusMinutes(30);
        agendamentoRepository.save(new Agendamento(null, cliente, barbeiro, servicoCabelo, inicioAgendado, fimAgendado, "AGENDADO"));

        mockMvc.perform(get("/api/agendamentos/disponibilidade")
                        .param("barbeiroId", barbeiro.getId().toString())
                        .param("servicoId", servicoCabelo.getId().toString())
                        .param("data", proximaTerca.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasItem("09:00")))
                .andExpect(jsonPath("$", hasItem("09:30")))
                .andExpect(jsonPath("$", not(hasItem("10:00")))) // Horário ocupado!
                .andExpect(jsonPath("$", hasItem("10:30")));
    }

    @Test
    @DisplayName("Deve criar agendamento com 201 Created e rejeitar conflito subsequente com 409 Conflict")
    void deveCriarAgendamentoERejeitarConflito() throws Exception {
        LocalDate proximaQuarta = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.WEDNESDAY));
        LocalDateTime inicio = LocalDateTime.of(proximaQuarta, java.time.LocalTime.of(14, 0));

        AgendamentoRequest request = new AgendamentoRequest(
                cliente.getId(),
                barbeiro.getId(),
                servicoBarba.getId(), // 60 minutos: 14:00 - 15:00
                inicio
        );

        // 1. Primeira chamada: sucesso (201)
        mockMvc.perform(post("/api/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.status", is("AGENDADO")))
                .andExpect(jsonPath("$.duracaoMinutos", is(60)));

        // 2. Segunda chamada (mesmo horário): rejeitada com 409 Conflict e shape exato da Seção 7
        mockMvc.perform(post("/api/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo", is("CONFLITO_HORARIO")))
                .andExpect(jsonPath("$.mensagem", is("Horário indisponível para este barbeiro.")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));
    }

    @Test
    @DisplayName("Deve cancelar agendamento via PATCH /api/agendamentos/{id}/cancelar e liberar o slot")
    void deveCancelarAgendamentoELiberarSlot() throws Exception {
        LocalDate proximaQuinta = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.THURSDAY));
        LocalDateTime inicio = LocalDateTime.of(proximaQuinta, java.time.LocalTime.of(11, 0));

        Agendamento agendamento = agendamentoRepository.save(new Agendamento(
                null, cliente, barbeiro, servicoCabelo, inicio, inicio.plusMinutes(30), "AGENDADO"
        ));

        // Cancela
        mockMvc.perform(patch("/api/agendamentos/" + agendamento.getId() + "/cancelar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CANCELADO")));

        // Verifica que o slot das 11:00 está liberado novamente
        mockMvc.perform(get("/api/agendamentos/disponibilidade")
                        .param("barbeiroId", barbeiro.getId().toString())
                        .param("servicoId", servicoCabelo.getId().toString())
                        .param("data", proximaQuinta.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasItem("11:00")));
    }
}
