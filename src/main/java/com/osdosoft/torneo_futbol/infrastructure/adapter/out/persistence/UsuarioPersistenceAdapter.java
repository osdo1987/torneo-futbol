package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence;

import com.osdosoft.torneo_futbol.domain.model.Rol;
import com.osdosoft.torneo_futbol.domain.model.Usuario;
import com.osdosoft.torneo_futbol.domain.port.out.UsuarioRepositoryPort;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaUsuarioRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final JpaUsuarioRepository jpaRepository;

    public UsuarioPersistenceAdapter(JpaUsuarioRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<Usuario> findByUsername(String username) {
        return jpaRepository.findByUsername(username).map(this::mapToDomain);
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity entity = mapToEntity(usuario);
        return mapToDomain(jpaRepository.save(entity));
    }

    private Usuario mapToDomain(UsuarioEntity entity) {
        Rol rol = new Rol(entity.getRol().getNombre(), entity.getRol().getPermisos());
        return new Usuario(
                entity.getId(),
                entity.getUsername(),
                entity.getPassword(),
                entity.getEmail(),
                rol,
                entity.getEquipoId());
    }

    private UsuarioEntity mapToEntity(Usuario usuario) {
        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(usuario.getId());
        entity.setUsername(usuario.getUsername());
        entity.setPassword(usuario.getPassword());
        entity.setEmail(usuario.getEmail());
        // El rol debería existir ya en DB
        entity.setEquipoId(usuario.getEquipoId());
        return entity;
    }
}
