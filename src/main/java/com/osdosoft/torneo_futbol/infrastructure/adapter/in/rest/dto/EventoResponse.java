package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.util.UUID;

public record EventoResponse(
        UUID id,
        UUID partidoId,
        UUID jugadorId,
        String tipo,
        int minuto,
        String descripcion) {
}
