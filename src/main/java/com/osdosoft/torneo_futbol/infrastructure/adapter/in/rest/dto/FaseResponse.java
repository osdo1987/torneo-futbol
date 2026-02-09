package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.util.UUID;

public record FaseResponse(
        UUID id,
        String nombre,
        int orden,
        String tipo,
        boolean completada) {
}
