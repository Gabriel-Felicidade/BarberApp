package com.barberapp.dto;

import com.barberapp.model.Servico;
import java.math.BigDecimal;

public record ServicoResponse(
    Long id,
    String nome,
    String descricao,
    BigDecimal preco,
    Integer duracaoMinutos
) {
    public static ServicoResponse fromEntity(Servico servico) {
        return new ServicoResponse(
            servico.getId(),
            servico.getNome(),
            servico.getDescricao(),
            servico.getPreco(),
            servico.getDuracaoMinutos()
        );
    }
}
