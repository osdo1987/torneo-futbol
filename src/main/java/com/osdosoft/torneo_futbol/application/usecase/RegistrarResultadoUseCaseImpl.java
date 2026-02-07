package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.model.enums.EstadoTorneo;
import com.osdosoft.torneo_futbol.domain.port.in.RegistrarResultadoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public class RegistrarResultadoUseCaseImpl implements RegistrarResultadoUseCase {

    private final PartidoRepositoryPort partidoRepository;
    private final TorneoRepositoryPort torneoRepository;

    public RegistrarResultadoUseCaseImpl(PartidoRepositoryPort partidoRepository,
            TorneoRepositoryPort torneoRepository) {
        this.partidoRepository = partidoRepository;
        this.torneoRepository = torneoRepository;
    }

    @Override
    @Transactional
    public Partido registrarResultado(UUID partidoId, int golesLocal, int golesVisitante) {
        Partido partido = partidoRepository.findByPartidoId(partidoId)
                .orElseThrow(() -> new IllegalArgumentException("Partido no encontrado"));

        Torneo torneo = torneoRepository.findById(partido.getTorneoId())
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));

        if (torneo.getEstado() == EstadoTorneo.CREADO
                || torneo.getEstado() == EstadoTorneo.INSCRIPCIONES_ABIERTAS
                || torneo.getEstado() == EstadoTorneo.INSCRIPCIONES_CERRADAS) {
            throw new IllegalStateException("El torneo aun no ha iniciado");
        }

        if (torneo.getEstado() == EstadoTorneo.FINALIZADO) {
            throw new IllegalStateException("El torneo ya finalizo");
        }

        if (torneo.getEstado() == EstadoTorneo.SORTEADO) {
            torneo.iniciarTorneo();
            torneoRepository.save(torneo);
        }

        partido.registrarMarcador(golesLocal, golesVisitante);
        return partidoRepository.save(partido);
    }
}
