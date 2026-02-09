package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity;

import com.osdosoft.torneo_futbol.domain.model.enums.ResultadoPartido;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "partidos")
public class PartidoEntity {
    @Id
    private UUID id;
    private UUID torneoId;
    private UUID equipoLocalId;
    private UUID equipoVisitanteId;
    private LocalDateTime fechaProgramada;
    private int golesLocal;
    private int golesVisitante;
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ResultadoPartido resultado;
    private int jornada;

    public PartidoEntity() {
    }

    public PartidoEntity(UUID id, UUID torneoId, UUID local, UUID visitante, int jornada, LocalDateTime fecha, int gl,
            int gv, ResultadoPartido res) {
        this.id = id;
        this.torneoId = torneoId;
        this.equipoLocalId = local;
        this.equipoVisitanteId = visitante;
        this.jornada = jornada;
        this.fechaProgramada = fecha;
        this.golesLocal = gl;
        this.golesVisitante = gv;
        this.resultado = res;
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

    public UUID getEquipoLocalId() {
        return equipoLocalId;
    }

    public void setEquipoLocalId(UUID equipoLocalId) {
        this.equipoLocalId = equipoLocalId;
    }

    public UUID getEquipoVisitanteId() {
        return equipoVisitanteId;
    }

    public void setEquipoVisitanteId(UUID equipoVisitanteId) {
        this.equipoVisitanteId = equipoVisitanteId;
    }

    public LocalDateTime getFechaProgramada() {
        return fechaProgramada;
    }

    public void setFechaProgramada(LocalDateTime fechaProgramada) {
        this.fechaProgramada = fechaProgramada;
    }

    public int getGolesLocal() {
        return golesLocal;
    }

    public void setGolesLocal(int golesLocal) {
        this.golesLocal = golesLocal;
    }

    public int getGolesVisitante() {
        return golesVisitante;
    }

    public void setGolesVisitante(int golesVisitante) {
        this.golesVisitante = golesVisitante;
    }

    public ResultadoPartido getResultado() {
        return resultado;
    }

    public void setResultado(ResultadoPartido resultado) {
        this.resultado = resultado;
    }

    public int getJornada() {
        return jornada;
    }

    public void setJornada(int jornada) {
        this.jornada = jornada;
    }
}
