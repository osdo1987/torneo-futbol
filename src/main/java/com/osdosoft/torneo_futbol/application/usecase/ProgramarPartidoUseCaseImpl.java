package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.port.in.ProgramarPartidoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import java.time.LocalDateTime;
import java.util.UUID;

public class ProgramarPartidoUseCaseImpl implements ProgramarPartidoUseCase {

    private final PartidoRepositoryPort partidoRepository;

    public ProgramarPartidoUseCaseImpl(PartidoRepositoryPort partidoRepository) {
        this.partidoRepository = partidoRepository;
    }

    @Override
    public Partido programarPartido(UUID partidoId, LocalDateTime fechaProgramada) {
        Partido partido = partidoRepository.findByPartidoId(partidoId)
                .orElseThrow(() -> new IllegalArgumentException("Partido no encontrado"));
        partido.programar(fechaProgramada);
        return partidoRepository.save(partido);
    }
}
