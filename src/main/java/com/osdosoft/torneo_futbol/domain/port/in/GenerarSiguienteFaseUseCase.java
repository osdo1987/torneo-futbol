package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import java.util.UUID;

public interface GenerarSiguienteFaseUseCase {
    Fase ejecutar(UUID torneoId, UUID faseActualId, UUID nuevaFaseId, String nombreNuevaFase);
}
