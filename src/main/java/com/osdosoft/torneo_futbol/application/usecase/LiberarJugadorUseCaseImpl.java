package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Jugador;
import com.osdosoft.torneo_futbol.domain.port.in.LiberarJugadorUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.JugadorRepositoryPort;
import java.util.UUID;

public class LiberarJugadorUseCaseImpl implements LiberarJugadorUseCase {

    private final JugadorRepositoryPort jugadorRepository;

    public LiberarJugadorUseCaseImpl(JugadorRepositoryPort jugadorRepository) {
        this.jugadorRepository = jugadorRepository;
    }

    @Override
    public Jugador liberarJugador(UUID jugadorId) {
        Jugador jugador = jugadorRepository.findByJugadorId(jugadorId)
                .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado"));
        jugador.liberar();
        return jugadorRepository.save(jugador);
    }
}
