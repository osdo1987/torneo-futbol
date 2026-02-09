package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.in.ControlarInscripcionesJugadoresUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.UUID;

public class ControlarInscripcionesJugadoresUseCaseImpl implements ControlarInscripcionesJugadoresUseCase {

    private final TorneoRepositoryPort torneoRepository;

    public ControlarInscripcionesJugadoresUseCaseImpl(TorneoRepositoryPort torneoRepository) {
        this.torneoRepository = torneoRepository;
    }

    @Override
    public Torneo toggleInscripcionesJugadores(UUID torneoId, boolean abrir) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));
        torneo.setInscripcionesJugadoresAbiertas(abrir);
        return torneoRepository.save(torneo);
    }
}
