package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.util.UUID;

public record JugadorResponse(
                UUID id,
                String nombre,
                int numeroCamiseta,
                UUID equipoId,
                String documentoIdentidad,
                boolean activo) {
}
