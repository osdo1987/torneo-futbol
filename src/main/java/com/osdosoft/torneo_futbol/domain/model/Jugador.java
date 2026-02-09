package com.osdosoft.torneo_futbol.domain.model;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Jugador {
    private final UUID id;
    private final String nombre;
    private final int numeroCamiseta;
    private final UUID equipoId;
    private final Map<String, String> atributosAdicionales;

    public Jugador(UUID id, String nombre, int numeroCamiseta, UUID equipoId) {
        this(id, nombre, numeroCamiseta, equipoId, new HashMap<>());
    }

    public Jugador(UUID id, String nombre, int numeroCamiseta, UUID equipoId,
            Map<String, String> atributosAdicionales) {
        this.id = id;
        this.nombre = nombre;
        this.numeroCamiseta = numeroCamiseta;
        this.equipoId = equipoId;
        this.atributosAdicionales = atributosAdicionales != null ? new HashMap<>(atributosAdicionales)
                : new HashMap<>();
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

    public Map<String, String> getAtributosAdicionales() {
        return new HashMap<>(atributosAdicionales);
    }

    public String getAtributo(String clave) {
        return atributosAdicionales.get(clave);
    }
}
