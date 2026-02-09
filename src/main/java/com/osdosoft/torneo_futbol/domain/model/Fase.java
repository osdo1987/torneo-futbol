package com.osdosoft.torneo_futbol.domain.model;

import com.osdosoft.torneo_futbol.domain.model.enums.TipoFase;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Fase {
    private final UUID id;
    private final UUID torneoId;
    private final String nombre;
    private final int orden;
    private final TipoFase tipo;
    private final List<Partido> partidos;
    private boolean completada;

    public Fase(UUID id, UUID torneoId, String nombre, int orden, TipoFase tipo) {
        this.id = id;
        this.torneoId = torneoId;
        this.nombre = nombre;
        this.orden = orden;
        this.tipo = tipo;
        this.partidos = new ArrayList<>();
        this.completada = false;
    }

    public void agregarPartido(Partido partido) {
        this.partidos.add(partido);
    }

    public void marcarComoCompletada() {
        this.completada = true;
    }

    public UUID getId() {
        return id;
    }

    public UUID getTorneoId() {
        return torneoId;
    }

    public String getNombre() {
        return nombre;
    }

    public int getOrden() {
        return orden;
    }

    public TipoFase getTipo() {
        return tipo;
    }

    public List<Partido> getPartidos() {
        return new ArrayList<>(partidos);
    }

    public boolean isCompletada() {
        return completada;
    }
}
