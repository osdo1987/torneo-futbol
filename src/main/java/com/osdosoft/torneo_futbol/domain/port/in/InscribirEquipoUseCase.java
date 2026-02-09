package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import java.util.UUID;

public interface InscribirEquipoUseCase {
    Equipo inscribirEquipo(UUID torneoId, String nombreEquipo, String delegadoEmail, String delegadoDocumento);
}
