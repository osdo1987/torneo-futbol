package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Jugador;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.model.enums.EstadoTorneo;
import com.osdosoft.torneo_futbol.domain.port.in.InscribirJugadorUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.EquipoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.JugadorRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.UUID;

public class InscribirJugadorUseCaseImpl implements InscribirJugadorUseCase {

    private final JugadorRepositoryPort jugadorRepository;
    private final TorneoRepositoryPort torneoRepository;
    private final EquipoRepositoryPort equipoRepository;

    public InscribirJugadorUseCaseImpl(JugadorRepositoryPort jugadorRepository, TorneoRepositoryPort torneoRepository,
            EquipoRepositoryPort equipoRepository) {
        this.jugadorRepository = jugadorRepository;
        this.torneoRepository = torneoRepository;
        this.equipoRepository = equipoRepository;
    }

    @Override
    public Jugador inscribirJugador(UUID equipoId, String nombre, int numeroCamiseta, UUID torneoId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));

        if (torneo.getEstado() != EstadoTorneo.INSCRIPCIONES_ABIERTAS) {
            throw new IllegalStateException("Inscripciones cerradas");
        }

        Equipo equipo = equipoRepository.findByEquipoId(equipoId)
                .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado"));

        if (!equipo.getTorneoId().equals(torneoId)) {
            throw new IllegalArgumentException("El equipo no pertenece al torneo");
        }

        int count = jugadorRepository.countByEquipoId(equipoId);
        if (count >= torneo.getMaxJugadoresPorEquipo()) {
            throw new IllegalStateException("Maximo de jugadores alcanzado para el equipo");
        }

        if (jugadorRepository.existsByEquipoIdAndNumeroCamiseta(equipoId, numeroCamiseta)) {
            throw new IllegalArgumentException("Numero de camiseta ya existe en el equipo");
        }

        Jugador jugador = new Jugador(UUID.randomUUID(), nombre, numeroCamiseta, equipoId);
        return jugadorRepository.save(jugador);
    }
}
