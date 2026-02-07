package com.osdosoft.torneo_futbol.domain.port.in;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Jugador;
import java.util.List;
import java.util.UUID;

public interface ConsultarEquiposUseCase {
    List<Equipo> listarEquipos(UUID torneoId);

    List<Jugador> listarJugadores(UUID equipoId);
}
