package com.osdosoft.torneo_futbol.domain.model;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Jugador {
    private final UUID id;
    private final String nombre;
    private final int numeroCamiseta;
    private final UUID equipoId;
    private final String documentoIdentidad;
    private boolean activo;
    private final Map<String, String> atributosAdicionales;

    public Jugador(UUID id, String nombre, int numeroCamiseta, UUID equipoId, String documentoIdentidad) {
        this(id, nombre, numeroCamiseta, equipoId, documentoIdentidad, true, new HashMap<>());
    }

    public Jugador(UUID id, String nombre, int numeroCamiseta, UUID equipoId, String documentoIdentidad, boolean activo,
            Map<String, String> atributosAdicionales) {
        this.id = id;
        this.nombre = nombre;
        this.numeroCamiseta = numeroCamiseta;
        this.equipoId = equipoId;
        this.documentoIdentidad = documentoIdentidad;
        this.activo = activo;
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

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public void liberar() {
        this.activo = false;
    }
}
