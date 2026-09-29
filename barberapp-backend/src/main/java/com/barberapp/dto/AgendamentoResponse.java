package com.barberapp.dto;

import com.barberapp.model.Agendamento;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AgendamentoResponse(
    Long id,
    Long clienteId,
    String clienteNome,
    String clienteTelefone,
    Long barbeiroId,
    String barbeiroNome,
    String especialidade,
    Long servicoId,
    String servicoNome,
    BigDecimal preco,
    Integer duracaoMinutos,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime dataHoraInicio,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime dataHoraFim,
    String status
) {
    public static AgendamentoResponse fromEntity(Agendamento agendamento) {
        return new AgendamentoResponse(
            agendamento.getId(),
            agendamento.getCliente() != null ? agendamento.getCliente().getId() : null,
            agendamento.getCliente() != null ? agendamento.getCliente().getNome() : null,
            agendamento.getCliente() != null ? agendamento.getCliente().getTelefone() : null,
            agendamento.getBarbeiro() != null ? agendamento.getBarbeiro().getId() : null,
            agendamento.getBarbeiro() != null && agendamento.getBarbeiro().getUsuario() != null
                ? agendamento.getBarbeiro().getUsuario().getNome() : null,
            agendamento.getBarbeiro() != null ? agendamento.getBarbeiro().getEspecialidade() : null,
            agendamento.getServico() != null ? agendamento.getServico().getId() : null,
            agendamento.getServico() != null ? agendamento.getServico().getNome() : null,
            agendamento.getServico() != null ? agendamento.getServico().getPreco() : null,
            agendamento.getServico() != null ? agendamento.getServico().getDuracaoMinutos() : null,
            agendamento.getDataHoraInicio(),
            agendamento.getDataHoraFim(),
            agendamento.getStatus()
        );
    }
}
