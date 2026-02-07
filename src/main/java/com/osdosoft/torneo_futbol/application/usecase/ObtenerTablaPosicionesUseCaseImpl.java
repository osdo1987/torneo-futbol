package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.model.PosicionTabla;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.in.ObtenerTablaPosicionesUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.EquipoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.service.TablaPosicionesDomainService;
import java.util.List;
import java.util.UUID;

public class ObtenerTablaPosicionesUseCaseImpl implements ObtenerTablaPosicionesUseCase {

    private final TorneoRepositoryPort torneoRepository;
    private final EquipoRepositoryPort equipoRepository;
    private final PartidoRepositoryPort partidoRepository;
    private final TablaPosicionesDomainService tablaService;

    public ObtenerTablaPosicionesUseCaseImpl(TorneoRepositoryPort torneoRepository,
            EquipoRepositoryPort equipoRepository,
            PartidoRepositoryPort partidoRepository,
            TablaPosicionesDomainService tablaService) {
        this.torneoRepository = torneoRepository;
        this.equipoRepository = equipoRepository;
        this.partidoRepository = partidoRepository;
        this.tablaService = tablaService;
    }

    @Override
    public List<PosicionTabla> obtenerTabla(UUID torneoId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));
        List<Equipo> equipos = equipoRepository.findByTorneoId(torneoId);
        List<Partido> partidos = partidoRepository.findByTorneoIdAsList(torneoId);
        return tablaService.calcularTabla(torneo, equipos, partidos);
    }
}
