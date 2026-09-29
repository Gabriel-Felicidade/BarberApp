package com.barberapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@ConfigurationProperties(prefix = "horario")
public class HorarioExpedienteProperties {

    /**
     * Horário de abertura da barbearia (ex: 09:00).
     */
    private LocalTime abertura = LocalTime.of(9, 0);

    /**
     * Horário de fechamento da barbearia (ex: 19:00).
     */
    private LocalTime fechamento = LocalTime.of(19, 0);

    /**
     * Duração base de cada slot em minutos (ex: 30 minutos).
     */
    @Value("${slot.duracao.minutos:30}")
    private int slotDuracaoMinutos = 30;

    /**
     * Dias de atendimento separados por vírgula (ex: SEG,TER,QUA,QUI,SEX,SAB).
     */
    @Value("${dias.atendimento:SEG,TER,QUA,QUI,SEX,SAB}")
    private String diasAtendimentoRaw = "SEG,TER,QUA,QUI,SEX,SAB";

    public LocalTime getAbertura() {
        return abertura;
    }

    public void setAbertura(LocalTime abertura) {
        this.abertura = abertura;
    }

    public LocalTime getFechamento() {
        return fechamento;
    }

    public void setFechamento(LocalTime fechamento) {
        this.fechamento = fechamento;
    }

    public int getSlotDuracaoMinutos() {
        return slotDuracaoMinutos;
    }

    public void setSlotDuracaoMinutos(int slotDuracaoMinutos) {
        this.slotDuracaoMinutos = slotDuracaoMinutos;
    }

    public String getDiasAtendimentoRaw() {
        return diasAtendimentoRaw;
    }

    public void setDiasAtendimentoRaw(String diasAtendimentoRaw) {
        this.diasAtendimentoRaw = diasAtendimentoRaw;
    }

    /**
     * Converte a lista de siglas (SEG, TER, QUA, QUI, SEX, SAB, DOM) para DayOfWeek do Java.
     */
    public Set<DayOfWeek> getDiasAtendimento() {
        if (diasAtendimentoRaw == null || diasAtendimentoRaw.isBlank()) {
            return Collections.emptySet();
        }
        return Arrays.stream(diasAtendimentoRaw.split(","))
                .map(String::trim)
                .map(this::parseDayOfWeek)
                .collect(Collectors.toSet());
    }

    private DayOfWeek parseDayOfWeek(String sigla) {
        return switch (sigla.toUpperCase()) {
            case "SEG" -> DayOfWeek.MONDAY;
            case "TER" -> DayOfWeek.TUESDAY;
            case "QUA" -> DayOfWeek.WEDNESDAY;
            case "QUI" -> DayOfWeek.THURSDAY;
            case "SEX" -> DayOfWeek.FRIDAY;
            case "SAB" -> DayOfWeek.SATURDAY;
            case "DOM" -> DayOfWeek.SUNDAY;
            default -> throw new IllegalArgumentException("Sigla de dia inválida: " + sigla);
        };
    }
}
