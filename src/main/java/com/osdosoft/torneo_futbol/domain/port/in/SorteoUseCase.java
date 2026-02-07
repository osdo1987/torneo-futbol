package com.osdosoft.torneo_futbol.domain.port.in;

import java.util.UUID;

public interface SorteoUseCase {
    void ejecutarSorteo(UUID torneoId);
}
