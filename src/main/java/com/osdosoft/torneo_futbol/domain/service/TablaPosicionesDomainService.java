package com.osdosoft.torneo_futbol.domain.service;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.model.PosicionTabla;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.model.enums.ResultadoPartido;

import java.util.*;
import java.util.stream.Collectors;

public class TablaPosicionesDomainService {

    public List<PosicionTabla> calcularTabla(Torneo torneo, List<Equipo> equipos, List<Partido> partidos) {
        Map<UUID, PosicionTabla> tablaMap = new HashMap<>();

        // Initialize table
        for (Equipo equipo : equipos) {
            tablaMap.put(equipo.getId(), new PosicionTabla(equipo.getId(), equipo.getNombre()));
        }

        // Process matches
        for (Partido partido : partidos) {
            if (partido.getResultado() == ResultadoPartido.PENDIENTE) {
                continue;
            }

            PosicionTabla local = tablaMap.get(partido.getEquipoLocalId());
            PosicionTabla visitante = tablaMap.get(partido.getEquipoVisitanteId());

            if (local == null || visitante == null)
                continue; // Should not happen

            int gl = partido.getGolesLocal();
            int gv = partido.getGolesVisitante();

            if (partido.getResultado() == ResultadoPartido.LOCAL_GANO) {
                local.sumarVictoria(gl, gv, torneo.getPuntosVictoria());
                visitante.sumarDerrota(gv, gl, torneo.getPuntosDerrota());
            } else if (partido.getResultado() == ResultadoPartido.VISITANTE_GANO) {
                visitante.sumarVictoria(gv, gl, torneo.getPuntosVictoria());
                local.sumarDerrota(gl, gv, torneo.getPuntosDerrota());
            } else {
                local.sumarEmpate(gl, gv, torneo.getPuntosEmpate());
                visitante.sumarEmpate(gv, gl, torneo.getPuntosEmpate());
            }
        }

        return tablaMap.values().stream()
                .sorted(Comparator.comparingInt(PosicionTabla::getPuntos).reversed()
                        .thenComparingInt(PosicionTabla::getDiferenciaGoles).reversed()
                        .thenComparingInt(PosicionTabla::getGolesFavor).reversed())
                .collect(Collectors.toList());
    }
}
