package com.osdosoft.torneo_futbol.domain.model;

import java.util.UUID;

public class Jugador {
    private final UUID id;
    private final String nombre;
    private final int numeroCamiseta;
    private final UUID equipoId;

    public Jugador(UUID id, String nombre, int numeroCamiseta, UUID equipoId) {
        this.id = id;
        this.nombre = nombre;
        this.numeroCamiseta = numeroCamiseta;
        this.equipoId = equipoId;
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public int getNumeroCamiseta() {
        return numeroCamiseta;
    }

    public UUID getEquipoId() {
        return equipoId;
    }
}
