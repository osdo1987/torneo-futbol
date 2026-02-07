package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PartidoResponse(
        UUID id,
        UUID torneoId,
        UUID equipoLocalId,
        UUID equipoVisitanteId,
        LocalDateTime fechaProgramada,
        int golesLocal,
        int golesVisitante,
        String resultado,
        int jornada) {
}
