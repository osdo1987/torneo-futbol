package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Jugador;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarEquiposUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.EquipoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.JugadorRepositoryPort;
import java.util.List;
import java.util.UUID;

public class ConsultarEquiposUseCaseImpl implements ConsultarEquiposUseCase {

    private final EquipoRepositoryPort equipoRepository;
    private final JugadorRepositoryPort jugadorRepository;

    public ConsultarEquiposUseCaseImpl(EquipoRepositoryPort equipoRepository,
            JugadorRepositoryPort jugadorRepository) {
        this.equipoRepository = equipoRepository;
        this.jugadorRepository = jugadorRepository;
    }

    @Override
    public List<Equipo> listarEquipos(UUID torneoId) {
        return equipoRepository.findByTorneoId(torneoId);
    }

    @Override
    public List<Jugador> listarJugadores(UUID equipoId) {
        return jugadorRepository.findByEquipoId(equipoId);
    }
}
