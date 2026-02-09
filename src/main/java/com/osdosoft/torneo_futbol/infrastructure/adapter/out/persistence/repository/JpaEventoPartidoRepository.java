package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository;

import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.EventoPartidoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface JpaEventoPartidoRepository extends JpaRepository<EventoPartidoEntity, UUID> {
    List<EventoPartidoEntity> findByPartidoId(UUID partidoId);

    List<EventoPartidoEntity> findByJugadorId(UUID jugadorId);
}
