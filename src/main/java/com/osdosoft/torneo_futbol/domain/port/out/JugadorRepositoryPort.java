package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.Jugador;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface JugadorRepositoryPort {
    Jugador save(Jugador jugador);

    Optional<Jugador> findByJugadorId(UUID id);

    List<Jugador> findByEquipoId(UUID equipoId);

    int countByEquipoId(UUID equipoId);

    boolean existsByEquipoIdAndNumeroCamiseta(UUID equipoId, int numeroCamiseta);

    boolean existsByDocumentoIdentidad(String documentoIdentidad);
}
