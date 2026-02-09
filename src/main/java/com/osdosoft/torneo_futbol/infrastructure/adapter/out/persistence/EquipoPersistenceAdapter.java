package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.port.out.EquipoRepositoryPort;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.EquipoEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaEquipoRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class EquipoPersistenceAdapter implements EquipoRepositoryPort {

    private final JpaEquipoRepository equipoRepo;

    public EquipoPersistenceAdapter(JpaEquipoRepository equipoRepo) {
        this.equipoRepo = equipoRepo;
    }

    @Override
    public Equipo save(Equipo equipo) {
        EquipoEntity entity = new EquipoEntity(
                equipo.getId(),
                equipo.getNombre(),
                equipo.getDelegadoEmail(),
                equipo.getDelegadoDocumento(),
                equipo.getTorneoId());
        equipoRepo.save(entity);
        return equipo;
    }

    @Override
    public Optional<Equipo> findById(UUID id) {
        return equipoRepo.findById(id)
                .map(e -> new Equipo(e.getId(), e.getNombre(), e.getDelegadoEmail(), e.getDelegadoDocumento(),
                        e.getTorneoId()));
    }

    @Override
    public List<Equipo> findByTorneoId(UUID torneoId) {
        return equipoRepo.findByTorneoId(torneoId).stream()
                .map(e -> new Equipo(e.getId(), e.getNombre(), e.getDelegadoEmail(), e.getDelegadoDocumento(),
                        e.getTorneoId()))
                .collect(Collectors.toList());
    }
}
