package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FaseRepositoryPort {
    void save(Fase fase);

    Optional<Fase> findById(UUID id);

    List<Fase> findByTorneoId(UUID torneoId);
}
