package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import com.osdosoft.torneo_futbol.domain.port.out.FaseRepositoryPort;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.FaseEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaFaseRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class FasePersistenceAdapter implements FaseRepositoryPort {

    private final JpaFaseRepository faseRepo;

    public FasePersistenceAdapter(JpaFaseRepository faseRepo) {
        this.faseRepo = faseRepo;
    }

    @Override
    public void save(Fase fase) {
        FaseEntity entity = new FaseEntity(
                fase.getId(),
                fase.getTorneoId(),
                fase.getNombre(),
                fase.getOrden(),
                fase.getTipo(),
                fase.isCompletada());
        faseRepo.save(entity);
    }

    @Override
    public Optional<Fase> findById(UUID id) {
        return faseRepo.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Fase> findByTorneoId(UUID torneoId) {
        return faseRepo.findByTorneoId(torneoId).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    private Fase mapToDomain(FaseEntity e) {
        Fase fase = new Fase(e.getId(), e.getTorneoId(), e.getNombre(), e.getOrden(), e.getTipo());
        if (e.isCompletada()) {
            fase.marcarComoCompletada();
        }
        return fase;
    }
}
