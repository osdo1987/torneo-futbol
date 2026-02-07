package com.osdosoft.torneo_futbol.domain.model;

import com.osdosoft.torneo_futbol.domain.model.enums.EstadoTorneo;
import java.util.UUID;

public class Torneo {
    private final UUID id;
    private final String nombre;
    private EstadoTorneo estado;
    private final int maxJugadoresPorEquipo;
    private final int puntosVictoria;
    private final int puntosEmpate;
    private final int puntosDerrota;

    public Torneo(UUID id, String nombre, int maxJugadoresPorEquipo, int puntosVictoria, int puntosEmpate,
            int puntosDerrota) {
        this.id = id;
        this.nombre = nombre;
        this.maxJugadoresPorEquipo = maxJugadoresPorEquipo;
        this.puntosVictoria = puntosVictoria;
        this.puntosEmpate = puntosEmpate;
        this.puntosDerrota = puntosDerrota;
        this.estado = EstadoTorneo.CREADO;
    }

    public Torneo(UUID id, String nombre, EstadoTorneo estado, int maxJugadoresPorEquipo, int puntosVictoria,
            int puntosEmpate, int puntosDerrota) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado;
        this.maxJugadoresPorEquipo = maxJugadoresPorEquipo;
        this.puntosVictoria = puntosVictoria;
        this.puntosEmpate = puntosEmpate;
        this.puntosDerrota = puntosDerrota;
    }

    public void abrirInscripciones() {
        if (this.estado != EstadoTorneo.CREADO && this.estado != EstadoTorneo.INSCRIPCIONES_CERRADAS) {
            throw new IllegalStateException("Solo se pueden abrir inscripciones de un torneo CREADO o con inscripciones cerradas");
        }
        this.estado = EstadoTorneo.INSCRIPCIONES_ABIERTAS;
    }

    public void cerrarInscripciones() {
        if (this.estado != EstadoTorneo.INSCRIPCIONES_ABIERTAS) {
            throw new IllegalStateException("No se pueden cerrar inscripciones si no estan abiertas");
        }
        this.estado = EstadoTorneo.INSCRIPCIONES_CERRADAS;
    }

    public void marcarComoSorteado() {
        if (this.estado != EstadoTorneo.INSCRIPCIONES_CERRADAS) {
            throw new IllegalStateException("Solo se puede sortear un torneo con inscripciones cerradas");
        }
        this.estado = EstadoTorneo.SORTEADO;
    }

    public void iniciarTorneo() {
        if (this.estado != EstadoTorneo.SORTEADO) {
            throw new IllegalStateException("Solo se puede iniciar un torneo sorteado");
        }
        this.estado = EstadoTorneo.EN_JUEGO;
    }

    public void finalizarTorneo() {
        if (this.estado != EstadoTorneo.EN_JUEGO) {
            throw new IllegalStateException("Solo se puede finalizar un torneo en juego");
        }
        this.estado = EstadoTorneo.FINALIZADO;
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public EstadoTorneo getEstado() {
        return estado;
    }

    public int getMaxJugadoresPorEquipo() {
        return maxJugadoresPorEquipo;
    }

    public int getPuntosVictoria() {
        return puntosVictoria;
    }

    public int getPuntosEmpate() {
        return puntosEmpate;
    }

    public int getPuntosDerrota() {
        return puntosDerrota;
    }
}
