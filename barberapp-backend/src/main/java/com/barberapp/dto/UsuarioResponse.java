package com.barberapp.dto;

import com.barberapp.model.Usuario;

public record UsuarioResponse(
    Long id,
    String nome,
    String email,
    String telefone,
    String perfil
) {
    public static UsuarioResponse fromEntity(Usuario usuario) {
        return new UsuarioResponse(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getTelefone(),
            usuario.getPerfil()
        );
    }
}
