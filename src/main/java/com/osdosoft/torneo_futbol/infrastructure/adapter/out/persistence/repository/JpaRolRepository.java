package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository;

import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.RolEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JpaRolRepository extends JpaRepository<RolEntity, UUID> {
}
