package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository;

import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.EquipoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface JpaEquipoRepository extends JpaRepository<EquipoEntity, UUID> {
    List<EquipoEntity> findByTorneoId(UUID torneoId);
}
