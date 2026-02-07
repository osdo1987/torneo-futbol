package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.PosicionTabla;
import java.util.List;
import java.util.UUID;

public interface ObtenerTablaPosicionesUseCase {
    List<PosicionTabla> obtenerTabla(UUID torneoId);
}
