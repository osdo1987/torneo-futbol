package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository;

import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.PartidoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface JpaPartidoRepository extends JpaRepository<PartidoEntity, UUID> {
    List<PartidoEntity> findByTorneoId(UUID torneoId);
}
