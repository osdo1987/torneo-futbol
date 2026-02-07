package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import java.util.UUID;

public record PosicionTablaResponse(
        UUID equipoId,
        String nombreEquipo,
        int puntos,
        int partidosJugados,
        int partidosGanados,
        int partidosEmpatados,
        int partidosPerdidos,
        int golesFavor,
        int golesContra,
        int diferenciaGoles) {
}
