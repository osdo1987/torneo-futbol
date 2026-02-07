package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import java.util.UUID;

public interface CrearTorneoUseCase {
    Torneo crearTorneo(String nombre, int maxJugadores, int ptsVictoria, int ptsEmpate, int ptsDerrota);
}
