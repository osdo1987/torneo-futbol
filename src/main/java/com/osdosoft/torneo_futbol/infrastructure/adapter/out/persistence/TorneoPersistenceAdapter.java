package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.TorneoEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaTorneoRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TorneoPersistenceAdapter
        implements TorneoRepositoryPort {

    private final JpaTorneoRepository torneoRepo;

    public TorneoPersistenceAdapter(JpaTorneoRepository torneoRepo) {
        this.torneoRepo = torneoRepo;
    }

    // --- TorneoRepositoryPort ---
    @Override
    public Torneo save(Torneo torneo) {
        TorneoEntity entity = new TorneoEntity(torneo.getId(), torneo.getNombre(), torneo.getEstado(),
                torneo.getMaxJugadoresPorEquipo(), torneo.getPuntosVictoria(), torneo.getPuntosEmpate(),
                torneo.getPuntosDerrota());
        TorneoEntity saved = torneoRepo.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<Torneo> findById(UUID id) {
        return torneoRepo.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Torneo> findAll() {
        return torneoRepo.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    // --- Mapping Helpers ---
    private Torneo mapToDomain(TorneoEntity e) {
        return new Torneo(e.getId(), e.getNombre(), e.getEstado(), e.getMaxJugadoresPorEquipo(), e.getPuntosVictoria(),
                e.getPuntosEmpate(), e.getPuntosDerrota());
    }
}
