package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.PartidoEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaPartidoRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class PartidoPersistenceAdapter implements PartidoRepositoryPort {

    private final JpaPartidoRepository partidoRepo;


    public PartidoPersistenceAdapter(JpaPartidoRepository partidoRepo) {
        this.partidoRepo = partidoRepo;
    }

    @Override
    public Partido save(Partido partido) {
        PartidoEntity entity = new PartidoEntity(partido.getId(), partido.getTorneoId(), partido.getEquipoLocalId(),
                partido.getEquipoVisitanteId(), partido.getJornada(), partido.getFechaProgramada(),
                partido.getGolesLocal(), partido.getGolesVisitante(), partido.getResultado());
        partidoRepo.save(entity);
        return partido;
    }

    @Override
    public Optional<Partido> findByPartidoId(UUID id) {
        return partidoRepo.findById(id).map(this::mapPartidoToDomain);
    }

    @Override
    public List<Partido> findByTorneoIdAsList(UUID torneoId) {
        return partidoRepo.findByTorneoId(torneoId).stream().map(this::mapPartidoToDomain).collect(Collectors.toList());
    }

    @Override
    public void saveAll(List<Partido> partidos) {
        List<PartidoEntity> entities = partidos.stream()
                .map(p -> new PartidoEntity(p.getId(), p.getTorneoId(), p.getEquipoLocalId(), p.getEquipoVisitanteId(),
                        p.getJornada(), p.getFechaProgramada(), p.getGolesLocal(), p.getGolesVisitante(),
                        p.getResultado()))
                .collect(Collectors.toList());
        partidoRepo.saveAll(entities);
    }

    private Partido mapPartidoToDomain(PartidoEntity e) {
        return new Partido(e.getId(), e.getTorneoId(), e.getEquipoLocalId(), e.getEquipoVisitanteId(), e.getJornada(),
                e.getFechaProgramada(), e.getGolesLocal(), e.getGolesVisitante(), e.getResultado());
    }
}
