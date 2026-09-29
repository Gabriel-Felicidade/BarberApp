package com.barberapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BarbeiroRequest(
    @NotNull(message = "O ID do usuário é obrigatório")
    Long usuarioId,

    @NotBlank(message = "A especialidade é obrigatória")
    @Size(max = 100, message = "A especialidade deve ter no máximo 100 caracteres")
    String especialidade,

    Boolean ativo
) {}
