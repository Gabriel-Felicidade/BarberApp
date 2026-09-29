package com.barberapp.repository;

import com.barberapp.model.Barbeiro;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {

    List<Barbeiro> findByAtivoTrue();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Barbeiro b WHERE b.id = :id")
    Optional<Barbeiro> findByIdWithPessimisticLock(@Param("id") Long id);
}
