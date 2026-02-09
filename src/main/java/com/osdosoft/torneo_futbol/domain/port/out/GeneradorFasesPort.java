package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import java.util.List;
import java.util.UUID;

public interface GeneradorFasesPort {
    /**
     * Genera los partidos para una fase específica basándose en los equipos
     * participantes.
     */
    List<Partido> generarPartidos(Fase fase, List<UUID> equiposIds);
}
