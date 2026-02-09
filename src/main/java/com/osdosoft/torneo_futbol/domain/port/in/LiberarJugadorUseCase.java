package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Jugador;
import java.util.UUID;

public interface LiberarJugadorUseCase {
    Jugador liberarJugador(UUID jugadorId);
}
