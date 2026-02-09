package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence;

import com.osdosoft.torneo_futbol.domain.model.Jugador;
import com.osdosoft.torneo_futbol.domain.port.out.JugadorRepositoryPort;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.JugadorEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaJugadorRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JugadorPersistenceAdapter implements JugadorRepositoryPort {

    private final JpaJugadorRepository jugadorRepo;

    public JugadorPersistenceAdapter(JpaJugadorRepository jugadorRepo) {
        this.jugadorRepo = jugadorRepo;
    }

    @Override
    public Jugador save(Jugador jugador) {
        JugadorEntity entity = new JugadorEntity(
                jugador.getId(),
                jugador.getNombre(),
                jugador.getNumeroCamiseta(),
                jugador.getEquipoId(),
                jugador.getDocumentoIdentidad(),
                jugador.isActivo());
        jugadorRepo.save(entity);
        return jugador;
    }

    @Override
    public Optional<Jugador> findByJugadorId(UUID id) {
        return jugadorRepo.findById(id)
                .map(e -> new Jugador(e.getId(), e.getNombre(), e.getNumeroCamiseta(), e.getEquipoId(),
                        e.getDocumentoIdentidad(), e.isActivo(), null));
    }

    @Override
    public List<Jugador> findByEquipoId(UUID equipoId) {
        return jugadorRepo.findByEquipoId(equipoId).stream()
                .map(e -> new Jugador(e.getId(), e.getNombre(), e.getNumeroCamiseta(), e.getEquipoId(),
                        e.getDocumentoIdentidad(), e.isActivo(), null))
                .collect(Collectors.toList());
    }

    @Override
    public int countByEquipoId(UUID equipoId) {
        return jugadorRepo.countByEquipoIdAndActivoTrue(equipoId);
    }

    @Override
    public boolean existsByEquipoIdAndNumeroCamiseta(UUID equipoId, int numeroCamiseta) {
        return jugadorRepo.existsByEquipoIdAndNumeroCamisetaAndActivoTrue(equipoId, numeroCamiseta);
    }

    @Override
    public boolean existsByDocumentoIdentidad(String documentoIdentidad) {
        return jugadorRepo.existsByDocumentoIdentidadAndActivoTrue(documentoIdentidad);
    }
}
