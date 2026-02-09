package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity;

import com.osdosoft.torneo_futbol.domain.model.enums.EstadoTorneo;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "torneos")
public class TorneoEntity {
    @Id
    private UUID id;
    private String nombre;
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private EstadoTorneo estado;
    private int maxJugadoresPorEquipo;
    private int puntosVictoria;
    private int puntosEmpate;
    private int puntosDerrota;
    private boolean inscripcionesJugadoresAbiertas;

    public TorneoEntity() {
    }

    public TorneoEntity(UUID id, String nombre, EstadoTorneo estado, int maxJugadores, int ptsVic, int ptsEmp,
            int ptsDer, boolean inscripcionesJugadoresAbiertas) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado;
        this.maxJugadoresPorEquipo = maxJugadores;
        this.puntosVictoria = ptsVic;
        this.puntosEmpate = ptsEmp;
        this.puntosDerrota = ptsDer;
        this.inscripcionesJugadoresAbiertas = inscripcionesJugadoresAbiertas;
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

    public EstadoTorneo getEstado() {
        return estado;
    }

    public void setEstado(EstadoTorneo estado) {
        this.estado = estado;
    }

    public int getMaxJugadoresPorEquipo() {
        return maxJugadoresPorEquipo;
    }

    public void setMaxJugadoresPorEquipo(int maxJugadoresPorEquipo) {
        this.maxJugadoresPorEquipo = maxJugadoresPorEquipo;
    }

    public int getPuntosVictoria() {
        return puntosVictoria;
    }

    public void setPuntosVictoria(int puntosVictoria) {
        this.puntosVictoria = puntosVictoria;
    }

    public int getPuntosEmpate() {
        return puntosEmpate;
    }

    public void setPuntosEmpate(int puntosEmpate) {
        this.puntosEmpate = puntosEmpate;
    }

    public int getPuntosDerrota() {
        return puntosDerrota;
    }

    public void setPuntosDerrota(int puntosDerrota) {
        this.puntosDerrota = puntosDerrota;
    }

    public boolean isInscripcionesJugadoresAbiertas() {
        return inscripcionesJugadoresAbiertas;
    }

    public void setInscripcionesJugadoresAbiertas(boolean inscripcionesJugadoresAbiertas) {
        this.inscripcionesJugadoresAbiertas = inscripcionesJugadoresAbiertas;
    }
}
