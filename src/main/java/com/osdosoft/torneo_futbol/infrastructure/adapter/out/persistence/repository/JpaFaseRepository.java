package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository;

import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.FaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface JpaFaseRepository extends JpaRepository<FaseEntity, UUID> {
    List<FaseEntity> findByTorneoId(UUID torneoId);
}
