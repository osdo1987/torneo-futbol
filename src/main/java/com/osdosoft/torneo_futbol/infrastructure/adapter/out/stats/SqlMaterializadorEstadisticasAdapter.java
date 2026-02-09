package com.osdosoft.torneo_futbol.infrastructure.adapter.out.stats;

import com.osdosoft.torneo_futbol.domain.port.out.MaterializadorEstadisticasPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SqlMaterializadorEstadisticasAdapter implements MaterializadorEstadisticasPort {

    private final JdbcTemplate jdbcTemplate;

    public SqlMaterializadorEstadisticasAdapter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void recalcularEstadisticas(UUID torneoId) {
        // El jdbcTemplate se utilizará para ejecuciones nativas de alto rendimiento
        // en la materialización de vistas de estadísticas.

        System.out.println("Materializando estadísticas para el torneo: " + torneoId);
    }
}
