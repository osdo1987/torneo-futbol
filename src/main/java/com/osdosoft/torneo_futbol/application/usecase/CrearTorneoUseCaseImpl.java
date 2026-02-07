package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.in.CrearTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.UUID;

public class CrearTorneoUseCaseImpl implements CrearTorneoUseCase {

    private final TorneoRepositoryPort torneoRepository;

    public CrearTorneoUseCaseImpl(TorneoRepositoryPort torneoRepository) {
        this.torneoRepository = torneoRepository;
    }

    @Override
    public Torneo crearTorneo(String nombre, int maxJugadores, int ptsVictoria, int ptsEmpate, int ptsDerrota) {
        Torneo torneo = new Torneo(UUID.randomUUID(), nombre, maxJugadores, ptsVictoria, ptsEmpate, ptsDerrota);
        return torneoRepository.save(torneo);
    }
}
