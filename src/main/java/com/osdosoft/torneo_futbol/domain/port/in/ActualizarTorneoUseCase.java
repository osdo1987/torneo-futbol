package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import java.util.UUID;

public interface ActualizarTorneoUseCase {
    Torneo actualizarTorneo(UUID torneoId, String nombre, int maxJugadores, int ptsVictoria, int ptsEmpate,
            int ptsDerrota);
}
