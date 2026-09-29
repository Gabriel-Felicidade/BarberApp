package com.barberapp.dto;

import java.time.LocalDate;
import java.util.List;

public record DisponibilidadeResponse(
    LocalDate data,
    Long barbeiroId,
    Long servicoId,
    List<String> horariosDisponiveis
) {}
