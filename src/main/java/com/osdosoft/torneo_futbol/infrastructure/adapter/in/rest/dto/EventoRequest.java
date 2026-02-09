package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import com.osdosoft.torneo_futbol.domain.model.enums.TipoEventoPartido;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record EventoRequest(
        @NotNull UUID jugadorId,
        @NotNull TipoEventoPartido tipo,
        @NotNull Integer minuto,
        String descripcion) {
}
