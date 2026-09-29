package com.barberapp.repository;

import com.barberapp.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("""
        SELECT COUNT(a) > 0 FROM Agendamento a
        WHERE a.barbeiro.id = :barbeiroId
        AND a.status = 'AGENDADO'
        AND (:novoInicio < a.dataHoraFim AND :novoFim > a.dataHoraInicio)
    """)
    boolean existsConflitoHorario(
        @Param("barbeiroId") Long barbeiroId,
        @Param("novoInicio") LocalDateTime novoInicio,
        @Param("novoFim") LocalDateTime novoFim
    );

    List<Agendamento> findByClienteIdOrderByDataHoraInicioDesc(Long clienteId);

    List<Agendamento> findByBarbeiroIdAndDataHoraInicioBetweenOrderByDataHoraInicioAsc(
        Long barbeiroId,
        LocalDateTime inicioDia,
        LocalDateTime fimDia
    );

    List<Agendamento> findByBarbeiroIdAndStatusAndDataHoraInicioBetween(
        Long barbeiroId,
        String status,
        LocalDateTime inicioDia,
        LocalDateTime fimDia
    );
}
