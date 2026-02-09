package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "equipos", uniqueConstraints = @UniqueConstraint(columnNames = { "torneoId", "nombre" }))
public class EquipoEntity {
    @Id
    private UUID id;
    private String nombre;
    private String delegadoEmail;
    private String delegadoDocumento;
    private UUID torneoId;

    public EquipoEntity() {
    }

    public EquipoEntity(UUID id, String nombre, String delegadoEmail, String delegadoDocumento, UUID torneoId) {
        this.id = id;
        this.nombre = nombre;
        this.delegadoEmail = delegadoEmail;
        this.delegadoDocumento = delegadoDocumento;
        this.torneoId = torneoId;
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

    public String getDelegadoEmail() {
        return delegadoEmail;
    }

    public void setDelegadoEmail(String delegadoEmail) {
        this.delegadoEmail = delegadoEmail;
    }

    public String getDelegadoDocumento() {
        return delegadoDocumento;
    }

    public void setDelegadoDocumento(String delegadoDocumento) {
        this.delegadoDocumento = delegadoDocumento;
    }

    public UUID getTorneoId() {
        return torneoId;
    }

    public void setTorneoId(UUID torneoId) {
        this.torneoId = torneoId;
    }
}
