package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface PartidoRepositoryPort {
    Partido save(Partido partido);

    Optional<Partido> findByPartidoId(UUID id);

    List<Partido> findByTorneoIdAsList(UUID torneoId);

    void saveAll(List<Partido> partidos);
}
