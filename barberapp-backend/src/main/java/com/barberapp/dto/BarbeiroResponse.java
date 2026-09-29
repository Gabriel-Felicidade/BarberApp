package com.barberapp.dto;

import com.barberapp.model.Barbeiro;

public record BarbeiroResponse(
    Long id,
    Long usuarioId,
    String nome,
    String email,
    String telefone,
    String especialidade,
    Boolean ativo
) {
    public static BarbeiroResponse fromEntity(Barbeiro barbeiro) {
        return new BarbeiroResponse(
            barbeiro.getId(),
            barbeiro.getUsuario() != null ? barbeiro.getUsuario().getId() : null,
            barbeiro.getUsuario() != null ? barbeiro.getUsuario().getNome() : null,
            barbeiro.getUsuario() != null ? barbeiro.getUsuario().getEmail() : null,
            barbeiro.getUsuario() != null ? barbeiro.getUsuario().getTelefone() : null,
            barbeiro.getEspecialidade(),
            barbeiro.getAtivo()
        );
    }
}
