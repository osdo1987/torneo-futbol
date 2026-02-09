package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.EventoPartido;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarEventosUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.EventoPartidoRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ConsultarEventosUseCaseImpl implements ConsultarEventosUseCase {

    private final EventoPartidoRepositoryPort eventoRepository;

    public ConsultarEventosUseCaseImpl(EventoPartidoRepositoryPort eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    @Override
    public List<EventoPartido> listarPorPartido(UUID partidoId) {
        return eventoRepository.findByPartidoId(partidoId);
    }
}
