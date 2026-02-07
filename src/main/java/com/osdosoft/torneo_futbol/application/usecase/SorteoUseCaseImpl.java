package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.model.enums.EstadoTorneo;
import com.osdosoft.torneo_futbol.domain.port.in.SorteoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.EquipoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.service.SorteoDomainService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public class SorteoUseCaseImpl implements SorteoUseCase {

    private final TorneoRepositoryPort torneoRepository;
    private final EquipoRepositoryPort equipoRepository;
    private final PartidoRepositoryPort partidoRepository;
    private final SorteoDomainService sorteoService;

    public SorteoUseCaseImpl(TorneoRepositoryPort torneoRepository, EquipoRepositoryPort equipoRepository,
            PartidoRepositoryPort partidoRepository, SorteoDomainService sorteoService) {
        this.torneoRepository = torneoRepository;
        this.equipoRepository = equipoRepository;
        this.partidoRepository = partidoRepository;
        this.sorteoService = sorteoService;
    }

    @Override
    @Transactional
    public void ejecutarSorteo(UUID torneoId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));

        if (torneo.getEstado() == EstadoTorneo.SORTEADO || torneo.getEstado() == EstadoTorneo.EN_JUEGO
                || torneo.getEstado() == EstadoTorneo.FINALIZADO) {
            throw new IllegalStateException("El torneo ya ha sido sorteado");
        }

        if (torneo.getEstado() != EstadoTorneo.INSCRIPCIONES_CERRADAS) {
            throw new IllegalStateException("Debe cerrar inscripciones antes del sorteo");
        }

        List<Equipo> equipos = equipoRepository.findByTorneoId(torneoId);
        List<Partido> fixture = sorteoService.generarFixture(torneoId, equipos);

        partidoRepository.saveAll(fixture);

        torneo.marcarComoSorteado();
        torneoRepository.save(torneo);
    }
}
