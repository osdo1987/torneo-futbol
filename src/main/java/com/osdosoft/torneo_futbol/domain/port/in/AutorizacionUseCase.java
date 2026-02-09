package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.enums.Permiso;
import java.util.UUID;

public interface AutorizacionUseCase {
    void validarPermiso(Permiso permiso);

    void validarPropiedadEquipo(UUID equipoId);

    void validarAccesoTorneo(UUID torneoId);
}
