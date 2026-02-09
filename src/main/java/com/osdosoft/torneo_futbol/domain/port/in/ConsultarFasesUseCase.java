package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import java.util.List;
import java.util.UUID;

public interface ConsultarFasesUseCase {
    List<Fase> listarPorTorneo(UUID torneoId);
}
