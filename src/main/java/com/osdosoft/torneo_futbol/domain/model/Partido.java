package com.osdosoft.torneo_futbol.domain.model;

import com.osdosoft.torneo_futbol.domain.model.enums.ResultadoPartido;
import java.time.LocalDateTime;
import java.util.UUID;

public class Partido {
    private final UUID id;
    private final UUID torneoId;
    private final UUID equipoLocalId;
    private final UUID equipoVisitanteId;
    private LocalDateTime fechaProgramada;
    private int golesLocal;
    private int golesVisitante;
    private ResultadoPartido resultado;
    private int jornada;

    public Partido(UUID id, UUID torneoId, UUID equipoLocalId, UUID equipoVisitanteId, int jornada) {
        this.id = id;
        this.torneoId = torneoId;
        this.equipoLocalId = equipoLocalId;
        this.equipoVisitanteId = equipoVisitanteId;
        this.jornada = jornada;
        this.resultado = ResultadoPartido.PENDIENTE;
        this.golesLocal = 0;
        this.golesVisitante = 0;
    }

    public Partido(UUID id, UUID torneoId, UUID equipoLocalId, UUID equipoVisitanteId, int jornada,
            LocalDateTime fechaProgramada, int golesLocal, int golesVisitante, ResultadoPartido resultado) {
        this.id = id;
        this.torneoId = torneoId;
        this.equipoLocalId = equipoLocalId;
        this.equipoVisitanteId = equipoVisitanteId;
        this.jornada = jornada;
        this.fechaProgramada = fechaProgramada;
        this.golesLocal = golesLocal;
        this.golesVisitante = golesVisitante;
        this.resultado = resultado;
    }

    public void programar(LocalDateTime fecha) {
        if (fecha == null) {
            throw new IllegalArgumentException("La fecha es obligatoria");
        }
        if (this.resultado != ResultadoPartido.PENDIENTE && this.resultado != ResultadoPartido.POSTERGADO) {
            throw new IllegalStateException("No se puede programar un partido finalizado");
        }
        this.fechaProgramada = fecha;
        // Si estaba postergado y se reprograma, vuelve a estar pendiente de resultado
        if (this.resultado == ResultadoPartido.POSTERGADO) {
            this.resultado = ResultadoPartido.PENDIENTE;
        }
    }

    public void aplazar() {
        if (this.resultado != ResultadoPartido.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden aplazar partidos pendientes");
        }
        this.resultado = ResultadoPartido.POSTERGADO;
    }

    public void registrarMarcador(int golesLocal, int golesVisitante) {
        if (this.resultado != ResultadoPartido.PENDIENTE) {
            throw new IllegalStateException("El resultado ya fue registrado");
        }
        if (golesLocal < 0 || golesVisitante < 0) {
            throw new IllegalArgumentException("Los goles no pueden ser negativos");
        }
        this.golesLocal = golesLocal;
        this.golesVisitante = golesVisitante;
        if (golesLocal > golesVisitante) {
            this.resultado = ResultadoPartido.LOCAL_GANO;
        } else if (golesVisitante > golesLocal) {
            this.resultado = ResultadoPartido.VISITANTE_GANO;
        } else {
            this.resultado = ResultadoPartido.EMPATE;
        }
    }

    public void actualizarGoles(int golesLocal, int golesVisitante) {
        if (this.resultado != ResultadoPartido.PENDIENTE) {
            throw new IllegalStateException(
                    "Solo se puede actualizar el marcador en tiempo real si el partido está pendiente");
        }
        this.golesLocal = golesLocal;
        this.golesVisitante = golesVisitante;
    }

    public UUID getId() {
        return id;
    }

    public UUID getTorneoId() {
        return torneoId;
    }

    public UUID getEquipoLocalId() {
        return equipoLocalId;
    }

    public UUID getEquipoVisitanteId() {
        return equipoVisitanteId;
    }

    public LocalDateTime getFechaProgramada() {
        return fechaProgramada;
    }

    public int getGolesLocal() {
        return golesLocal;
    }

    public int getGolesVisitante() {
        return golesVisitante;
    }

    public ResultadoPartido getResultado() {
        return resultado;
    }

    public int getJornada() {
        return jornada;
    }
}
