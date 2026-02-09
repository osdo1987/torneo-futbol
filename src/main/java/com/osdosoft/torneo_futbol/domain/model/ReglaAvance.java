package com.osdosoft.torneo_futbol.domain.model;

import java.util.List;
import java.util.UUID;

public interface ReglaAvance {
    /**
     * Determina qué equipos avanzan a la siguiente fase basándose en los resultados
     * de la fase actual.
     * 
     * @param faseActual La fase que acaba de terminar.
     * @param resultados Los resultados/estadísticas procesadas.
     * @return Lista de IDs de equipos que avanzan.
     */
    List<UUID> calcularEquiposQueAvanzan(Fase faseActual, List<PosicionTabla> resultados);
}
