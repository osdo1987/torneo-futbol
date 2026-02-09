package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import java.util.UUID;

public interface ActualizarMarcadorRealTimeUseCase {
    Partido actualizarMarcador(UUID partidoId, int golesLocal, int golesVisitante);
}
