package com.barberapp.controller;

import com.barberapp.dto.ServicoRequest;
import com.barberapp.dto.ServicoResponse;
import com.barberapp.service.ServicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@CrossOrigin(origins = "*")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    public ResponseEntity<List<ServicoResponse>> listarServicos() {
        List<ServicoResponse> lista = servicoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<ServicoResponse> cadastrarServico(@Valid @RequestBody ServicoRequest request) {
        ServicoResponse response = servicoService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicoResponse> buscarPorId(@PathVariable Long id) {
        ServicoResponse response = servicoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }
}
