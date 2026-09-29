package com.barberapp.service;

import com.barberapp.dto.ServicoRequest;
import com.barberapp.dto.ServicoResponse;
import com.barberapp.exception.RecursoNaoEncontradoException;
import com.barberapp.model.Servico;
import com.barberapp.repository.ServicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    @Transactional(readOnly = true)
    public List<ServicoResponse> listarTodos() {
        return servicoRepository.findAll().stream()
                .map(ServicoResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ServicoResponse cadastrar(ServicoRequest request) {
        Servico servico = new Servico(
                null,
                request.nome().trim(),
                request.descricao(),
                request.preco(),
                request.duracaoMinutos()
        );
        Servico salvo = servicoRepository.save(servico);
        return ServicoResponse.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public ServicoResponse buscarPorId(Long id) {
        return servicoRepository.findById(id)
                .map(ServicoResponse::fromEntity)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Serviço não encontrado com ID: " + id));
    }
}
