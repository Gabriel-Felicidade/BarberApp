package com.barberapp.service;

import com.barberapp.dto.UsuarioRequest;
import com.barberapp.dto.UsuarioResponse;
import com.barberapp.exception.RecursoNaoEncontradoException;
import com.barberapp.model.Usuario;
import com.barberapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public UsuarioResponse cadastrarCliente(UsuarioRequest request) {
        // Se o e-mail já existir, reutiliza o usuário cadastrado (experiência amigável de autoatendimento)
        Usuario usuario = usuarioRepository.findByEmail(request.email().trim())
                .map(existente -> {
                    existente.setNome(request.nome().trim());
                    existente.setTelefone(request.telefone().trim());
                    return usuarioRepository.save(existente);
                })
                .orElseGet(() -> {
                    Usuario novo = new Usuario(
                            null,
                            request.nome().trim(),
                            request.email().trim(),
                            request.telefone().trim(),
                            request.perfil() != null ? request.perfil() : "CLIENTE"
                    );
                    return usuarioRepository.save(novo);
                });

        return UsuarioResponse.fromEntity(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(UsuarioResponse::fromEntity)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
    }
}
