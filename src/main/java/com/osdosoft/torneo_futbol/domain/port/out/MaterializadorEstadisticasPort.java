package com.osdosoft.torneo_futbol.domain.port.out;

import java.util.UUID;

public interface MaterializadorEstadisticasPort {
    /**
     * Fuerza la actualización de las estadísticas basadas en los eventos actuales.
     * Útil para correcciones de resultados.
     */
    void recalcularEstadisticas(UUID torneoId);
}
