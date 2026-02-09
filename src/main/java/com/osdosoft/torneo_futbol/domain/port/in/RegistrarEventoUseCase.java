package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.enums.TipoEventoPartido;
import java.util.UUID;

public interface RegistrarEventoUseCase {
    void ejecutar(UUID partidoId, UUID jugadorId, TipoEventoPartido tipo, int minuto, String descripcion);
}
