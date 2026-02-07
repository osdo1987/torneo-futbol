package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.model.enums.EstadoTorneo;
import com.osdosoft.torneo_futbol.domain.port.in.ActualizarTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.UUID;

public class ActualizarTorneoUseCaseImpl implements ActualizarTorneoUseCase {

    private final TorneoRepositoryPort torneoRepository;

    public ActualizarTorneoUseCaseImpl(TorneoRepositoryPort torneoRepository) {
        this.torneoRepository = torneoRepository;
    }

    @Override
    public Torneo actualizarTorneo(UUID torneoId, String nombre, int maxJugadores, int ptsVictoria, int ptsEmpate,
            int ptsDerrota) {
        Torneo existente = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));

        if (existente.getEstado() != EstadoTorneo.CREADO) {
            throw new IllegalStateException("Solo se puede editar un torneo en estado CREADO");
        }

        Torneo actualizado = new Torneo(
                existente.getId(),
                nombre,
                existente.getEstado(),
                maxJugadores,
                ptsVictoria,
                ptsEmpate,
                ptsDerrota);

        return torneoRepository.save(actualizado);
    }
}
