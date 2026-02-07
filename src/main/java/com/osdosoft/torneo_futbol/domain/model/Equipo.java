package com.osdosoft.torneo_futbol.domain.model;

import java.util.UUID;

public class Equipo {
    private final UUID id;
    private final String nombre;
    private final String delegadoEmail;
    private final UUID torneoId;

    public Equipo(UUID id, String nombre, String delegadoEmail, UUID torneoId) {
        this.id = id;
        this.nombre = nombre;
        this.delegadoEmail = delegadoEmail;
        this.torneoId = torneoId;
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDelegadoEmail() {
        return delegadoEmail;
    }

    public UUID getTorneoId() {
        return torneoId;
    }
}
