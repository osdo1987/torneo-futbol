package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.in.AbrirInscripcionesUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.UUID;

public class AbrirInscripcionesUseCaseImpl implements AbrirInscripcionesUseCase {

    private final TorneoRepositoryPort torneoRepository;

    public AbrirInscripcionesUseCaseImpl(TorneoRepositoryPort torneoRepository) {
        this.torneoRepository = torneoRepository;
    }

    @Override
    public Torneo abrirInscripciones(UUID torneoId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));
        torneo.abrirInscripciones();
        return torneoRepository.save(torneo);
    }
}
