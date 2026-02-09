package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence;

import com.osdosoft.torneo_futbol.domain.model.EventoPartido;
import com.osdosoft.torneo_futbol.domain.port.out.EventoPartidoRepositoryPort;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.EventoPartidoEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaEventoPartidoRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class EventoPartidoPersistenceAdapter implements EventoPartidoRepositoryPort {

    private final JpaEventoPartidoRepository repository;

    public EventoPartidoPersistenceAdapter(JpaEventoPartidoRepository repository) {
        this.repository = repository;
    }

    @Override
    public void save(EventoPartido evento) {
        EventoPartidoEntity entity = new EventoPartidoEntity(
                evento.getId(),
                evento.getPartidoId(),
                evento.getJugadorId(),
                evento.getTipo(),
                evento.getMinuto(),
                evento.getDescripcion());
        repository.save(entity);
    }

    @Override
    public List<EventoPartido> findByPartidoId(UUID partidoId) {
        return repository.findByPartidoId(partidoId).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventoPartido> findByJugadorId(UUID jugadorId) {
        return repository.findByJugadorId(jugadorId).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID eventoId) {
        repository.deleteById(eventoId);
    }

    private EventoPartido mapToDomain(EventoPartidoEntity e) {
        return new EventoPartido(e.getId(), e.getPartidoId(), e.getJugadorId(), e.getTipo(), e.getMinuto(),
                e.getDescripcion());
    }
}
