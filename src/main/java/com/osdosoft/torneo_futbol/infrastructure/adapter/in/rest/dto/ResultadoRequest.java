package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.Min;

public record ResultadoRequest(
        @Min(value = 0, message = "Los goles no pueden ser negativos")
        int golesLocal,
        @Min(value = 0, message = "Los goles no pueden ser negativos")
        int golesVisitante) {
}
