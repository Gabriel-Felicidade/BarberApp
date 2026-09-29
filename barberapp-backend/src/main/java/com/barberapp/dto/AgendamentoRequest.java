package com.barberapp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record AgendamentoRequest(
    @NotNull(message = "O ID do cliente é obrigatório")
    Long clienteId,

    @NotNull(message = "O ID do barbeiro é obrigatório")
    Long barbeiroId,

    @NotNull(message = "O ID do serviço é obrigatório")
    Long servicoId,

    @NotNull(message = "A data e hora de início são obrigatórias")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    LocalDateTime dataHoraInicio
) {}
