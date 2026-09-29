package com.barberapp.controller;

import com.barberapp.dto.AgendamentoRequest;
import com.barberapp.dto.AgendamentoResponse;
import com.barberapp.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    /**
     * Retorna horários livres do dia, considerando a duração do serviço selecionado.
     */
    @GetMapping("/disponibilidade")
    public ResponseEntity<List<String>> listarDisponibilidade(
            @RequestParam("barbeiroId") Long barbeiroId,
            @RequestParam("servicoId") Long servicoId,
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<String> horariosLivres = agendamentoService.listarHorariosDisponiveis(barbeiroId, servicoId, data);
        return ResponseEntity.ok(horariosLivres);
    }

    /**
     * Cria um novo agendamento após validação de concorrência e conflitos de horário.
     */
    @PostMapping
    public ResponseEntity<AgendamentoResponse> criarAgendamento(@Valid @RequestBody AgendamentoRequest request) {
        AgendamentoResponse response = agendamentoService.criarAgendamento(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lista o histórico e os próximos agendamentos do cliente.
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<AgendamentoResponse>> listarPorCliente(@PathVariable("clienteId") Long clienteId) {
        List<AgendamentoResponse> lista = agendamentoService.listarPorCliente(clienteId);
        return ResponseEntity.ok(lista);
    }

    /**
     * Lista a agenda cronológica diária do barbeiro.
     */
    @GetMapping("/barbeiro/{barbeiroId}")
    public ResponseEntity<List<AgendamentoResponse>> listarPorBarbeiro(
            @PathVariable("barbeiroId") Long barbeiroId,
            @RequestParam(value = "data", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<AgendamentoResponse> lista = agendamentoService.listarPorBarbeiroEData(
                barbeiroId,
                data != null ? data : LocalDate.now()
        );
        return ResponseEntity.ok(lista);
    }

    /**
     * Cancela uma reserva, liberando imediatamente o horário.
     */
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponse> cancelarAgendamento(@PathVariable("id") Long id) {
        AgendamentoResponse response = agendamentoService.cancelar(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Marca o agendamento como concluído.
     */
    @PatchMapping("/{id}/concluir")
    public ResponseEntity<AgendamentoResponse> concluirAgendamento(@PathVariable("id") Long id) {
        AgendamentoResponse response = agendamentoService.concluir(id);
        return ResponseEntity.ok(response);
    }
}
