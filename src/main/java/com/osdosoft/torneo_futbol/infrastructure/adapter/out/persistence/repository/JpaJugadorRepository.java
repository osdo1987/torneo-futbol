package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository;

import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.JugadorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface JpaJugadorRepository extends JpaRepository<JugadorEntity, UUID> {
    List<JugadorEntity> findByEquipoId(UUID equipoId);

    int countByEquipoIdAndActivoTrue(UUID equipoId);

    boolean existsByEquipoIdAndNumeroCamisetaAndActivoTrue(UUID equipoId, int numeroCamiseta);

    boolean existsByDocumentoIdentidadAndActivoTrue(String documentoIdentidad);
}
