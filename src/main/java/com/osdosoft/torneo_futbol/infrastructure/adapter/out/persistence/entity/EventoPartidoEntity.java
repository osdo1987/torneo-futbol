package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity;

import com.osdosoft.torneo_futbol.domain.model.enums.TipoEventoPartido;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "eventos_partido")
public class EventoPartidoEntity {
    @Id
    private UUID id;
    private UUID partidoId;
    private UUID jugadorId;
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TipoEventoPartido tipo;
    private int minuto;
    private String descripcion;

    public EventoPartidoEntity() {
    }

    public EventoPartidoEntity(UUID id, UUID partidoId, UUID jugadorId, TipoEventoPartido tipo, int minuto,
            String descripcion) {
        this.id = id;
        this.partidoId = partidoId;
        this.jugadorId = jugadorId;
        this.tipo = tipo;
        this.minuto = minuto;
        this.descripcion = descripcion;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPartidoId() {
        return partidoId;
    }

    public void setPartidoId(UUID partidoId) {
        this.partidoId = partidoId;
    }

    public UUID getJugadorId() {
        return jugadorId;
    }

    public void setJugadorId(UUID jugadorId) {
        this.jugadorId = jugadorId;
    }

    public TipoEventoPartido getTipo() {
        return tipo;
    }

    public void setTipo(TipoEventoPartido tipo) {
        this.tipo = tipo;
    }

    public int getMinuto() {
        return minuto;
    }

    public void setMinuto(int minuto) {
        this.minuto = minuto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
