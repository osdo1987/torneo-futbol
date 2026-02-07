package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface EquipoRepositoryPort {
    Equipo save(Equipo equipo);

    Optional<Equipo> findById(UUID id);

    List<Equipo> findByTorneoId(UUID torneoId);
}
