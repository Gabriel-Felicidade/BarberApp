package com.barberapp.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.Instant;

public record ErrorResponse(
    String mensagem,
    String codigo,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    Instant timestamp
) {
    public ErrorResponse(String mensagem, String codigo) {
        this(mensagem, codigo, Instant.now());
    }
}
