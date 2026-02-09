package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.util.Set;
import java.util.UUID;

public record LoginResponse(
        UUID id,
        String username,
        String rol,
        Set<String> permisos,
        UUID equipoId) {
}
