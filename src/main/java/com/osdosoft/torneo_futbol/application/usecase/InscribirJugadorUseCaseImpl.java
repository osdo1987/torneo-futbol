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
    public Jugador inscribirJugador(UUID equipoId, String nombre, int numeroCamiseta, UUID torneoId,
            String documentoIdentidad) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));

        // Validar si las inscripciones de jugadores están abiertas específicamente
        if (!torneo.isInscripcionesJugadoresAbiertas() && torneo.getEstado() != EstadoTorneo.INSCRIPCIONES_ABIERTAS) {
            throw new IllegalStateException("Las inscripciones de jugadores no están abiertas actualmente");
        }

        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado"));

        if (!equipo.getTorneoId().equals(torneoId)) {
            throw new IllegalArgumentException("El equipo no pertenece al torneo");
        }

        int count = jugadorRepository.countByEquipoId(equipoId);
        if (count >= torneo.getMaxJugadoresPorEquipo()) {
            throw new IllegalStateException("Maximo de jugadores alcanzado para el equipo");
        }

        // Validar si el jugador ya está inscrito en algún equipo (por documento de
        // identidad)
        if (jugadorRepository.existsByDocumentoIdentidad(documentoIdentidad)) {
            throw new IllegalArgumentException("El jugador con este documento ya está inscrito en un equipo");
        }

        if (jugadorRepository.existsByEquipoIdAndNumeroCamiseta(equipoId, numeroCamiseta)) {
            throw new IllegalArgumentException("Numero de camiseta ya existe en el equipo");
        }

        Jugador jugador = new Jugador(UUID.randomUUID(), nombre, numeroCamiseta, equipoId, documentoIdentidad);
        return jugadorRepository.save(jugador);
    }
}
