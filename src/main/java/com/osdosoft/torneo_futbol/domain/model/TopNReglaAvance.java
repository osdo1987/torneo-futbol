package com.osdosoft.torneo_futbol.domain.model;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class TopNReglaAvance implements ReglaAvance {
    private final int n;

    public TopNReglaAvance(int n) {
        this.n = n;
    }

    @Override
    public List<UUID> calcularEquiposQueAvanzan(Fase faseActual, List<PosicionTabla> resultados) {
        return resultados.stream()
                .sorted(Comparator.comparingInt(PosicionTabla::getPuntos)
                        .thenComparingInt(PosicionTabla::getDiferenciaGoles)
                        .thenComparingInt(PosicionTabla::getGolesFavor).reversed())
                .limit(n)
                .map(PosicionTabla::getEquipoId)
                .collect(Collectors.toList());
    }
}
