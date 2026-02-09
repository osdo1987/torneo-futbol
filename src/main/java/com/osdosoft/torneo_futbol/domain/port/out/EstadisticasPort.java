package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.PosicionTabla;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface EstadisticasPort {
    List<PosicionTabla> obtenerTablaPosiciones(UUID faseId);

    Map<UUID, Integer> obtenerGoleadores(UUID torneoId);

    Map<UUID, Integer> obtenerAsistencias(UUID torneoId);

    Map<UUID, Integer> obtenerVallaMenosVencida(UUID torneoId);

    Map<UUID, Integer> obtenerPuntosFairPlay(UUID torneoId);
}
