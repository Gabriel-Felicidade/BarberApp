package com.barberapp.service;

import com.barberapp.dto.BarbeiroRequest;
import com.barberapp.dto.BarbeiroResponse;
import com.barberapp.exception.RecursoNaoEncontradoException;
import com.barberapp.model.Barbeiro;
import com.barberapp.model.Usuario;
import com.barberapp.repository.BarbeiroRepository;
import com.barberapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BarbeiroService {

    private final BarbeiroRepository barbeiroRepository;
    private final UsuarioRepository usuarioRepository;

    public BarbeiroService(BarbeiroRepository barbeiroRepository, UsuarioRepository usuarioRepository) {
        this.barbeiroRepository = barbeiroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<BarbeiroResponse> listarAtivos() {
        return barbeiroRepository.findByAtivoTrue().stream()
                .map(BarbeiroResponse::fromEntity)
                .toList();
    }

    @Transactional
    public BarbeiroResponse cadastrar(BarbeiroRequest request) {
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com ID: " + request.usuarioId()));

        usuario.setPerfil("BARBEIRO");
        usuarioRepository.save(usuario);

        Barbeiro barbeiro = new Barbeiro(
                null,
                usuario,
                request.especialidade(),
                request.ativo() != null ? request.ativo() : true
        );

        Barbeiro salvo = barbeiroRepository.save(barbeiro);
        return BarbeiroResponse.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public BarbeiroResponse buscarPorId(Long id) {
        return barbeiroRepository.findById(id)
                .map(BarbeiroResponse::fromEntity)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Barbeiro não encontrado com ID: " + id));
    }
}
