package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import java.util.UUID;

public interface CerrarInscripcionesUseCase {
    Torneo cerrarInscripciones(UUID torneoId);
}
