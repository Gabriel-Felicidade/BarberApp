package com.barberapp.controller;

import com.barberapp.dto.BarbeiroRequest;
import com.barberapp.dto.BarbeiroResponse;
import com.barberapp.service.BarbeiroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barbeiros")
@CrossOrigin(origins = "*")
public class BarbeiroController {

    private final BarbeiroService barbeiroService;

    public BarbeiroController(BarbeiroService barbeiroService) {
        this.barbeiroService = barbeiroService;
    }

    @GetMapping
    public ResponseEntity<List<BarbeiroResponse>> listarBarbeiros() {
        List<BarbeiroResponse> lista = barbeiroService.listarAtivos();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<BarbeiroResponse> cadastrarBarbeiro(@Valid @RequestBody BarbeiroRequest request) {
        BarbeiroResponse response = barbeiroService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarbeiroResponse> buscarPorId(@PathVariable Long id) {
        BarbeiroResponse response = barbeiroService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }
}
