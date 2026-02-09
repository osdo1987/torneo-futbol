package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.EventoPartido;
import java.util.List;
import java.util.UUID;

public interface EventoPartidoRepositoryPort {
    void save(EventoPartido evento);

    List<EventoPartido> findByPartidoId(UUID partidoId);

    List<EventoPartido> findByJugadorId(UUID jugadorId);

    void delete(UUID eventoId);
}
