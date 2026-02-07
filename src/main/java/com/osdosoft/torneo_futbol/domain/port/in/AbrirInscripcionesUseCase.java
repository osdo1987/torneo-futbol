package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Torneo;
import java.util.UUID;

public interface AbrirInscripcionesUseCase {
    Torneo abrirInscripciones(UUID torneoId);
}
