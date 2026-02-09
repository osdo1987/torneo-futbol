package com.osdosoft.torneo_futbol.infrastructure.adapter.out.stats;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.EventoPartido;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.model.PosicionTabla;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.model.enums.EstadoTorneo;
import com.osdosoft.torneo_futbol.domain.model.enums.TipoEventoPartido;
import com.osdosoft.torneo_futbol.domain.port.out.EquipoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.EstadisticasPort;
import com.osdosoft.torneo_futbol.domain.port.out.EventoPartidoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.service.TablaPosicionesDomainService;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class SqlEstadisticasAdapter implements EstadisticasPort {

    private final PartidoRepositoryPort partidoRepository;
    private final TorneoRepositoryPort torneoRepository;
    private final EquipoRepositoryPort equipoRepository;
    private final EventoPartidoRepositoryPort eventoRepository;
    private final TablaPosicionesDomainService tablaService = new TablaPosicionesDomainService();

    public SqlEstadisticasAdapter(PartidoRepositoryPort partidoRepository,
            TorneoRepositoryPort torneoRepository,
            EquipoRepositoryPort equipoRepository,
            EventoPartidoRepositoryPort eventoRepository) {
        this.partidoRepository = partidoRepository;
        this.torneoRepository = torneoRepository;
        this.equipoRepository = equipoRepository;
        this.eventoRepository = eventoRepository;
    }

    @Override
    public List<PosicionTabla> obtenerTablaPosiciones(UUID faseId) {
        // En un sistema real buscaríamos la fase para obtener su TorneoId
        // Por ahora, obtenemos el torneo activo
        List<Torneo> torneos = torneoRepository.findAll();
        if (torneos.isEmpty()) {
            throw new IllegalStateException("No existe un torneo configurado");
        }

        Torneo torneo = torneos.stream()
                .filter(t -> t.getEstado() == EstadoTorneo.EN_JUEGO)
                .findFirst()
                .orElse(torneos.get(0));

        List<Equipo> equipos = equipoRepository.findByTorneoId(torneo.getId());
        List<Partido> partidos = partidoRepository.findByTorneoIdAsList(torneo.getId());

        return tablaService.calcularTabla(torneo, equipos, partidos);
    }

    @Override
    public Map<UUID, Integer> obtenerGoleadores(UUID torneoId) {
        List<Partido> partidos = partidoRepository.findByTorneoIdAsList(torneoId);
        Map<UUID, Integer> golesMap = new HashMap<>();

        for (Partido p : partidos) {
            List<EventoPartido> eventos = eventoRepository.findByPartidoId(p.getId());
            for (EventoPartido e : eventos) {
                if (e.getTipo() == TipoEventoPartido.GOL) {
                    golesMap.merge(e.getJugadorId(), 1, Integer::sum);
                }
            }
        }
        return golesMap;
    }

    @Override
    public Map<UUID, Integer> obtenerAsistencias(UUID torneoId) {
        return new HashMap<>();
    }

    @Override
    public Map<UUID, Integer> obtenerVallaMenosVencida(UUID torneoId) {
        return new HashMap<>();
    }

    @Override
    public Map<UUID, Integer> obtenerPuntosFairPlay(UUID torneoId) {
        List<Partido> partidos = partidoRepository.findByTorneoIdAsList(torneoId);
        Map<UUID, Integer> fairPlayMap = new HashMap<>();

        for (Partido p : partidos) {
            List<EventoPartido> eventos = eventoRepository.findByPartidoId(p.getId());
            for (EventoPartido e : eventos) {
                int pts = 0;
                if (e.getTipo() == TipoEventoPartido.TARJETA_AMARILLA)
                    pts = 1;
                if (e.getTipo() == TipoEventoPartido.TARJETA_ROJA)
                    pts = 3;

                if (pts > 0) {
                    fairPlayMap.merge(e.getJugadorId(), pts, Integer::sum);
                }
            }
        }
        return fairPlayMap;
    }
}
