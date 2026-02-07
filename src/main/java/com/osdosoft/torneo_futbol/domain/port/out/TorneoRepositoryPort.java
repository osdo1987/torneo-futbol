package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface TorneoRepositoryPort {
    Torneo save(Torneo torneo);

    Optional<Torneo> findById(UUID id);

    List<Torneo> findAll();
}
