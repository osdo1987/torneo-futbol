package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import java.util.UUID;

public interface AplazarPartidoUseCase {
    Partido aplazarPartido(UUID partidoId);
}
