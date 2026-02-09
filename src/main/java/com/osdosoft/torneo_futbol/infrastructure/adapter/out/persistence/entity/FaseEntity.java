package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity;

import com.osdosoft.torneo_futbol.domain.model.enums.TipoFase;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "fases")
public class FaseEntity {
    @Id
    private UUID id;
    private UUID torneoId;
    private String nombre;
    private int orden;
    @Enumerated(EnumType.STRING)
    private TipoFase tipo;
    private boolean completada;

    public FaseEntity() {
    }

    public FaseEntity(UUID id, UUID torneoId, String nombre, int orden, TipoFase tipo, boolean completada) {
        this.id = id;
        this.torneoId = torneoId;
        this.nombre = nombre;
        this.orden = orden;
        this.tipo = tipo;
        this.completada = completada;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTorneoId() {
        return torneoId;
    }

    public void setTorneoId(UUID torneoId) {
        this.torneoId = torneoId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getOrden() {
        return orden;
    }

    public void setOrden(int orden) {
        this.orden = orden;
    }

    public TipoFase getTipo() {
        return tipo;
    }

    public void setTipo(TipoFase tipo) {
        this.tipo = tipo;
    }

    public boolean isCompletada() {
        return completada;
    }

    public void setCompletada(boolean completada) {
        this.completada = completada;
    }
}
