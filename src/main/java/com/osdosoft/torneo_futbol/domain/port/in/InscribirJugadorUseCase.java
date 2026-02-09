package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Jugador;
import java.util.UUID;

public interface InscribirJugadorUseCase {
    Jugador inscribirJugador(UUID equipoId, String nombre, int numeroCamiseta, UUID torneoId,
            String documentoIdentidad);
}
