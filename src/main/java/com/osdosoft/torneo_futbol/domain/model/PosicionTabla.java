package com.osdosoft.torneo_futbol.domain.model;

import java.util.UUID;

public class PosicionTabla {
    private final UUID equipoId;
    private final String nombreEquipo;
    private int puntos;
    private int partidosJugados;
    private int partidosGanados;
    private int partidosEmpatados;
    private int partidosPerdidos;
    private int golesFavor;
    private int golesContra;

    public PosicionTabla(UUID equipoId, String nombreEquipo) {
        this.equipoId = equipoId;
        this.nombreEquipo = nombreEquipo;
    }

    public void sumarVictoria(int golesF, int golesC, int puntosPorVictoria) {
        puntos += puntosPorVictoria;
        partidosJugados++;
        partidosGanados++;
        golesFavor += golesF;
        golesContra += golesC;
    }

    public void sumarEmpate(int golesF, int golesC, int puntosPorEmpate) {
        puntos += puntosPorEmpate;
        partidosJugados++;
        partidosEmpatados++;
        golesFavor += golesF;
        golesContra += golesC;
    }

    public void sumarDerrota(int golesF, int golesC, int puntosPorDerrota) {
        puntos += puntosPorDerrota;
        partidosJugados++;
        partidosPerdidos++;
        golesFavor += golesF;
        golesContra += golesC;
    }

    public int getDiferenciaGoles() {
        return golesFavor - golesContra;
    }

    public UUID getEquipoId() {
        return equipoId;
    }

    public String getNombreEquipo() {
        return nombreEquipo;
    }

    public int getPuntos() {
        return puntos;
    }

    public int getPartidosJugados() {
        return partidosJugados;
    }

    public int getPartidosGanados() {
        return partidosGanados;
    }

    public int getPartidosEmpatados() {
        return partidosEmpatados;
    }

    public int getPartidosPerdidos() {
        return partidosPerdidos;
    }

    public int getGolesFavor() {
        return golesFavor;
    }

    public int getGolesContra() {
        return golesContra;
    }
}
