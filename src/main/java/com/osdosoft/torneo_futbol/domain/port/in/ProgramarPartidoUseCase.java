package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import java.time.LocalDateTime;
import java.util.UUID;

public interface ProgramarPartidoUseCase {
    Partido programarPartido(UUID partidoId, LocalDateTime fechaProgramada);
}
