package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.port.in.AplazarPartidoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import java.util.UUID;

public class AplazarPartidoUseCaseImpl implements AplazarPartidoUseCase {

    private final PartidoRepositoryPort partidoRepository;

    public AplazarPartidoUseCaseImpl(PartidoRepositoryPort partidoRepository) {
        this.partidoRepository = partidoRepository;
    }

    @Override
    public Partido aplazarPartido(UUID partidoId) {
        Partido partido = partidoRepository.findByPartidoId(partidoId)
                .orElseThrow(() -> new IllegalArgumentException("Partido no encontrado"));
        partido.aplazar();
        return partidoRepository.save(partido);
    }
}
