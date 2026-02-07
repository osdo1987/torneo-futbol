package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import java.util.List;
import java.util.UUID;

public interface ConsultarTorneoUseCase {
    Torneo getTorneo(UUID id);

    List<Torneo> getAllTorneos();

    List<Partido> getPartidos(UUID torneoId);
}
