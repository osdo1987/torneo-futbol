package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.EventoPartido;
import java.util.List;
import java.util.UUID;

public interface ConsultarEventosUseCase {
    List<EventoPartido> listarPorPartido(UUID partidoId);
}
