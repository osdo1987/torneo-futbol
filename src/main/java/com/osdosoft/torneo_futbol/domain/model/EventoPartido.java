package com.osdosoft.torneo_futbol.domain.model;

import com.osdosoft.torneo_futbol.domain.model.enums.TipoEventoPartido;
import java.util.UUID;

public class EventoPartido {
    private final UUID id;
    private final UUID partidoId;
    private final UUID jugadorId;
    private final TipoEventoPartido tipo;
    private final int minuto;
    private final String descripcion;

    public EventoPartido(UUID id, UUID partidoId, UUID jugadorId, TipoEventoPartido tipo, int minuto,
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

    public UUID getPartidoId() {
        return partidoId;
    }

    public UUID getJugadorId() {
        return jugadorId;
    }

    public TipoEventoPartido getTipo() {
        return tipo;
    }

    public int getMinuto() {
        return minuto;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
