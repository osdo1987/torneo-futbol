package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record TorneoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @Min(value = 1, message = "El maximo de jugadores por equipo debe ser mayor o igual a 1")
        int maxJugadoresPorEquipo,
        @Min(value = 0, message = "Los puntos por victoria no pueden ser negativos")
        int puntosVictoria,
        @Min(value = 0, message = "Los puntos por empate no pueden ser negativos")
        int puntosEmpate,
        @Min(value = 0, message = "Los puntos por derrota no pueden ser negativos")
        int puntosDerrota) {
}
