package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.util.UUID;

public record EquipoResponse(
        UUID id,
        String nombre,
        String delegadoEmail,
        UUID torneoId) {
}
