package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.util.UUID;

public record TorneoResponse(
        UUID id,
        String nombre,
        String estado,
        int maxJugadoresPorEquipo) {
}
