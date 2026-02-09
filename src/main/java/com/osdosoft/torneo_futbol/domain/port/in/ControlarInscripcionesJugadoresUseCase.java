package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import java.util.UUID;

public interface ControlarInscripcionesJugadoresUseCase {
    Torneo toggleInscripcionesJugadores(UUID torneoId, boolean abrir);
}
