package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository;

import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface JpaUsuarioRepository extends JpaRepository<UsuarioEntity, UUID> {
    Optional<UsuarioEntity> findByUsername(String username);
}
