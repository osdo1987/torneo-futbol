package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record ProgramarPartidoRequest(
        @NotNull(message = "La fecha programada es obligatoria")
        LocalDateTime fechaProgramada) {
}
