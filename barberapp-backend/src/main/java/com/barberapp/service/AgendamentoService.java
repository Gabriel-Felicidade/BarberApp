package com.barberapp.service;

import com.barberapp.config.HorarioExpedienteProperties;
import com.barberapp.dto.AgendamentoRequest;
import com.barberapp.dto.AgendamentoResponse;
import com.barberapp.exception.ConflitoHorarioException;
import com.barberapp.exception.RecursoNaoEncontradoException;
import com.barberapp.exception.RequisicaoInvalidaException;
import com.barberapp.model.Agendamento;
import com.barberapp.model.Barbeiro;
import com.barberapp.model.Servico;
import com.barberapp.model.Usuario;
import com.barberapp.repository.AgendamentoRepository;
import com.barberapp.repository.BarbeiroRepository;
import com.barberapp.repository.ServicoRepository;
import com.barberapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final BarbeiroRepository barbeiroRepository;
    private final ServicoRepository servicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HorarioExpedienteProperties horarioProperties;

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            BarbeiroRepository barbeiroRepository,
            ServicoRepository servicoRepository,
            UsuarioRepository usuarioRepository,
            HorarioExpedienteProperties horarioProperties) {
        this.agendamentoRepository = agendamentoRepository;
        this.barbeiroRepository = barbeiroRepository;
        this.servicoRepository = servicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.horarioProperties = horarioProperties;
    }

    /**
     * Calcula dinamicamente os horários livres para um barbeiro e serviço em uma data específica.
     */
    @Transactional(readOnly = true)
    public List<String> listarHorariosDisponiveis(Long barbeiroId, Long servicoId, LocalDate data) {
        if (barbeiroId == null || servicoId == null || data == null) {
            throw new RequisicaoInvalidaException("Parâmetros barbeiroId, servicoId e data são obrigatórios.");
        }

        Barbeiro barbeiro = barbeiroRepository.findById(barbeiroId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Barbeiro não encontrado com ID: " + barbeiroId));

        if (Boolean.FALSE.equals(barbeiro.getAtivo())) {
            return Collections.emptyList();
        }

        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Serviço não encontrado com ID: " + servicoId));

        // Valida se a data cai em dia de atendimento
        if (!horarioProperties.getDiasAtendimento().contains(data.getDayOfWeek())) {
            return Collections.emptyList();
        }

        LocalTime abertura = horarioProperties.getAbertura();
        LocalTime fechamento = horarioProperties.getFechamento();
        int stepMinutos = horarioProperties.getSlotDuracaoMinutos();
        int duracaoServico = servico.getDuracaoMinutos();

        List<String> slotsLivres = new ArrayList<>();
        LocalTime slotAtual = abertura;

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        while (!slotAtual.plusMinutes(duracaoServico).isAfter(fechamento)) {
            LocalDateTime inicioSlot = LocalDateTime.of(data, slotAtual);
            LocalDateTime fimSlot = inicioSlot.plusMinutes(duracaoServico);

            boolean conflito = agendamentoRepository.existsConflitoHorario(barbeiroId, inicioSlot, fimSlot);
            if (!conflito) {
                slotsLivres.add(slotAtual.format(timeFormatter));
            }

            slotAtual = slotAtual.plusMinutes(stepMinutos);
        }

        return slotsLivres;
    }

    /**
     * Cria um novo agendamento com controle de concorrência via Lock Pessimista (SELECT ... FOR UPDATE).
     */
    @Transactional
    public AgendamentoResponse criarAgendamento(AgendamentoRequest request) {
        if (request == null || request.clienteId() == null || request.barbeiroId() == null
                || request.servicoId() == null || request.dataHoraInicio() == null) {
            throw new RequisicaoInvalidaException("Todos os campos do agendamento são obrigatórios.");
        }

        // 1. Lock pessimista na linha do barbeiro para serializar agendamentos concorrentes
        Barbeiro barbeiro = barbeiroRepository.findByIdWithPessimisticLock(request.barbeiroId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Barbeiro não encontrado com ID: " + request.barbeiroId()));

        if (Boolean.FALSE.equals(barbeiro.getAtivo())) {
            throw new RequisicaoInvalidaException("O barbeiro selecionado não está ativo no momento.");
        }

        // 2. Busca o cliente e serviço
        Usuario cliente = usuarioRepository.findById(request.clienteId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado com ID: " + request.clienteId()));

        Servico servico = servicoRepository.findById(request.servicoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Serviço não encontrado com ID: " + request.servicoId()));

        LocalDateTime dataHoraInicio = request.dataHoraInicio();
        LocalDateTime dataHoraFim = dataHoraInicio.plusMinutes(servico.getDuracaoMinutos());

        // 3. Validação de expediente e dia de atendimento
        LocalDate data = dataHoraInicio.toLocalDate();
        LocalTime inicioTime = dataHoraInicio.toLocalTime();
        LocalTime fimTime = dataHoraFim.toLocalTime();

        if (!horarioProperties.getDiasAtendimento().contains(data.getDayOfWeek())) {
            throw new RequisicaoInvalidaException("Data fora dos dias de atendimento da barbearia.");
        }

        if (inicioTime.isBefore(horarioProperties.getAbertura()) || fimTime.isAfter(horarioProperties.getFechamento())) {
            throw new RequisicaoInvalidaException("Horário solicitado fora do expediente de funcionamento.");
        }

        // 4. Checagem de colisão de horário
        boolean conflito = agendamentoRepository.existsConflitoHorario(barbeiro.getId(), dataHoraInicio, dataHoraFim);
        if (conflito) {
            throw new ConflitoHorarioException("Horário indisponível para este barbeiro.");
        }

        // 5. Inserção do agendamento
        Agendamento agendamento = new Agendamento(
                null,
                cliente,
                barbeiro,
                servico,
                dataHoraInicio,
                dataHoraFim,
                "AGENDADO"
        );

        Agendamento salvo = agendamentoRepository.save(agendamento);
        return AgendamentoResponse.fromEntity(salvo);
    }

    /**
     * Lista histórico e próximos agendamentos de um cliente específico.
     */
    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listarPorCliente(Long clienteId) {
        if (!usuarioRepository.existsById(clienteId)) {
            throw new RecursoNaoEncontradoException("Cliente não encontrado com ID: " + clienteId);
        }
        return agendamentoRepository.findByClienteIdOrderByDataHoraInicioDesc(clienteId)
                .stream()
                .map(AgendamentoResponse::fromEntity)
                .toList();
    }

    /**
     * Lista a agenda cronológica diária de um barbeiro específico.
     */
    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listarPorBarbeiroEData(Long barbeiroId, LocalDate data) {
        if (!barbeiroRepository.existsById(barbeiroId)) {
            throw new RecursoNaoEncontradoException("Barbeiro não encontrado com ID: " + barbeiroId);
        }

        LocalDate dataConsulta = data != null ? data : LocalDate.now();
        LocalDateTime inicioDia = dataConsulta.atStartOfDay();
        LocalDateTime fimDia = dataConsulta.atTime(LocalTime.MAX);

        return agendamentoRepository.findByBarbeiroIdAndDataHoraInicioBetweenOrderByDataHoraInicioAsc(
                barbeiroId, inicioDia, fimDia)
                .stream()
                .map(AgendamentoResponse::fromEntity)
                .toList();
    }

    /**
     * Cancela uma reserva, liberando o horário imediatamente.
     */
    @Transactional
    public AgendamentoResponse cancelar(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento não encontrado com ID: " + id));

        agendamento.setStatus("CANCELADO");
        Agendamento atualizado = agendamentoRepository.save(agendamento);
        return AgendamentoResponse.fromEntity(atualizado);
    }

    /**
     * Marca o agendamento como concluído.
     */
    @Transactional
    public AgendamentoResponse concluir(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Agendamento não encontrado com ID: " + id));

        agendamento.setStatus("CONCLUIDO");
        Agendamento atualizado = agendamentoRepository.save(agendamento);
        return AgendamentoResponse.fromEntity(atualizado);
    }
}
