package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.port.in.ActualizarMarcadorRealTimeUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import java.util.UUID;

public class ActualizarMarcadorRealTimeUseCaseImpl implements ActualizarMarcadorRealTimeUseCase {

    private final PartidoRepositoryPort partidoRepository;

    public ActualizarMarcadorRealTimeUseCaseImpl(PartidoRepositoryPort partidoRepository) {
        this.partidoRepository = partidoRepository;
    }

    @Override
    public Partido actualizarMarcador(UUID partidoId, int golesLocal, int golesVisitante) {
        Partido partido = partidoRepository.findByPartidoId(partidoId)
                .orElseThrow(() -> new IllegalArgumentException("Partido no encontrado"));
        partido.actualizarGoles(golesLocal, golesVisitante);
        return partidoRepository.save(partido);
    }
}
