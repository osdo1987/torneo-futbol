package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.in.CerrarInscripcionesUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.UUID;

public class CerrarInscripcionesUseCaseImpl implements CerrarInscripcionesUseCase {

    private final TorneoRepositoryPort torneoRepository;

    public CerrarInscripcionesUseCaseImpl(TorneoRepositoryPort torneoRepository) {
        this.torneoRepository = torneoRepository;
    }

    @Override
    public Torneo cerrarInscripciones(UUID torneoId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));
        torneo.cerrarInscripciones();
        return torneoRepository.save(torneo);
    }
}
