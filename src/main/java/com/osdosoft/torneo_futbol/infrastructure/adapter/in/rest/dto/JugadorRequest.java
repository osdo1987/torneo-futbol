package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record JugadorRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @Min(value = 1, message = "El numero de camiseta debe ser mayor o igual a 1")
        int numeroCamiseta) {
}
