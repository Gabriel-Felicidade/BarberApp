package com.barberapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ServicoRequest(
    @NotBlank(message = "O nome do serviço é obrigatório")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    String nome,

    String descricao,

    @NotNull(message = "O preço é obrigatório")
    @DecimalMin(value = "0.0", inclusive = true, message = "O preço deve ser maior ou igual a zero")
    BigDecimal preco,

    @NotNull(message = "A duração em minutos é obrigatória")
    @Min(value = 1, message = "A duração deve ser de pelo menos 1 minuto")
    Integer duracaoMinutos
) {}
