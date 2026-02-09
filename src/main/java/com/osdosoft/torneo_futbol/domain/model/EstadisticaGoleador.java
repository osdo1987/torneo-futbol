package com.osdosoft.torneo_futbol.domain.model;

import java.util.UUID;

public class EstadisticaGoleador {
    private final UUID jugadorId;
    private final String nombreJugador;
    private final String nombreEquipo;
    private final int goles;

    public EstadisticaGoleador(UUID jugadorId, String nombreJugador, String nombreEquipo, int goles) {
        this.jugadorId = jugadorId;
        this.nombreJugador = nombreJugador;
        this.nombreEquipo = nombreEquipo;
        this.goles = goles;
    }

    public UUID getJugadorId() {
        return jugadorId;
    }

    public String getNombreJugador() {
        return nombreJugador;
    }

    public String getNombreEquipo() {
        return nombreEquipo;
    }

    public int getGoles() {
        return goles;
    }
}
