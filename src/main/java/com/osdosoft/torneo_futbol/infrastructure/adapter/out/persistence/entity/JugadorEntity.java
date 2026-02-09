package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "jugadores", uniqueConstraints = @UniqueConstraint(columnNames = { "equipoId", "numeroCamiseta" }))
public class JugadorEntity {
    @Id
    private UUID id;
    private String nombre;
    private int numeroCamiseta;
    private UUID equipoId;
    @Column(unique = true)
    private String documentoIdentidad;
    private boolean activo;

    public JugadorEntity() {
    }

    public JugadorEntity(UUID id, String nombre, int numeroCamiseta, UUID equipoId, String documentoIdentidad,
            boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.numeroCamiseta = numeroCamiseta;
        this.equipoId = equipoId;
        this.documentoIdentidad = documentoIdentidad;
        this.activo = activo;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getNumeroCamiseta() {
        return numeroCamiseta;
    }

    public void setNumeroCamiseta(int numeroCamiseta) {
        this.numeroCamiseta = numeroCamiseta;
    }

    public UUID getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(UUID equipoId) {
        this.equipoId = equipoId;
    }

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
