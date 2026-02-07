package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.in.FinalizarTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.UUID;

public class FinalizarTorneoUseCaseImpl implements FinalizarTorneoUseCase {

    private final TorneoRepositoryPort torneoRepository;

    public FinalizarTorneoUseCaseImpl(TorneoRepositoryPort torneoRepository) {
        this.torneoRepository = torneoRepository;
    }

    @Override
    public Torneo finalizarTorneo(UUID torneoId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));
        torneo.finalizarTorneo();
        return torneoRepository.save(torneo);
    }
}
