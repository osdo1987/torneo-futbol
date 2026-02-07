package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence;

import com.osdosoft.torneo_futbol.domain.model.*;
import com.osdosoft.torneo_futbol.domain.port.out.*;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.*;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TorneoPersistenceAdapter
        implements TorneoRepositoryPort, EquipoRepositoryPort, JugadorRepositoryPort, PartidoRepositoryPort {

    private final JpaTorneoRepository torneoRepo;
    private final JpaEquipoRepository equipoRepo;
    private final JpaJugadorRepository jugadorRepo;
    private final JpaPartidoRepository partidoRepo;

    public TorneoPersistenceAdapter(JpaTorneoRepository torneoRepo, JpaEquipoRepository equipoRepo,
            JpaJugadorRepository jugadorRepo, JpaPartidoRepository partidoRepo) {
        this.torneoRepo = torneoRepo;
        this.equipoRepo = equipoRepo;
        this.jugadorRepo = jugadorRepo;
        this.partidoRepo = partidoRepo;
    }

    // --- TorneoRepositoryPort ---
    @Override
    public Torneo save(Torneo torneo) {
        TorneoEntity entity = new TorneoEntity(torneo.getId(), torneo.getNombre(), torneo.getEstado(),
                torneo.getMaxJugadoresPorEquipo(), torneo.getPuntosVictoria(), torneo.getPuntosEmpate(),
                torneo.getPuntosDerrota());
        TorneoEntity saved = torneoRepo.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<Torneo> findById(UUID id) {
        return torneoRepo.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Torneo> findAll() {
        return torneoRepo.findAll().stream().map(this::mapToDomain).collect(Collectors.toList());
    }

    // --- EquipoRepositoryPort ---
    @Override
    public Equipo save(Equipo equipo) {
        EquipoEntity entity = new EquipoEntity(equipo.getId(), equipo.getNombre(), equipo.getDelegadoEmail(),
                equipo.getTorneoId());
        equipoRepo.save(entity);
        return equipo;
    }

    @Override
    public Optional<Equipo> findById(UUID id) {
        return equipoRepo.findById(id)
                .map(e -> new Equipo(e.getId(), e.getNombre(), e.getDelegadoEmail(), e.getTorneoId()));
    }

    @Override
    public List<Equipo> findByTorneoId(UUID torneoId) {
        return equipoRepo.findByTorneoId(torneoId).stream()
                .map(e -> new Equipo(e.getId(), e.getNombre(), e.getDelegadoEmail(), e.getTorneoId()))
                .collect(Collectors.toList());
    }

    // --- JugadorRepositoryPort ---
    @Override
    public Jugador save(Jugador jugador) {
        JugadorEntity entity = new JugadorEntity(jugador.getId(), jugador.getNombre(), jugador.getNumeroCamiseta(),
                jugador.getEquipoId());
        jugadorRepo.save(entity);
        return jugador;
    }

    @Override
    public Optional<Jugador> findByJugadorId(UUID id) {
        return jugadorRepo.findById(id)
                .map(e -> new Jugador(e.getId(), e.getNombre(), e.getNumeroCamiseta(), e.getEquipoId()));
    }

    @Override
    public List<Jugador> findByEquipoId(UUID equipoId) {
        return jugadorRepo.findByEquipoId(equipoId).stream()
                .map(e -> new Jugador(e.getId(), e.getNombre(), e.getNumeroCamiseta(), e.getEquipoId()))
                .collect(Collectors.toList());
    }

    @Override
    public int countByEquipoId(UUID equipoId) {
        return jugadorRepo.countByEquipoId(equipoId);
    }

    @Override
    public boolean existsByEquipoIdAndNumeroCamiseta(UUID equipoId, int numeroCamiseta) {
        return jugadorRepo.existsByEquipoIdAndNumeroCamiseta(equipoId, numeroCamiseta);
    }

    // --- PartidoRepositoryPort ---
    @Override
    public Partido save(Partido partido) {
        PartidoEntity entity = new PartidoEntity(partido.getId(), partido.getTorneoId(), partido.getEquipoLocalId(),
                partido.getEquipoVisitanteId(), partido.getJornada(), partido.getFechaProgramada(),
                partido.getGolesLocal(), partido.getGolesVisitante(), partido.getResultado());
        partidoRepo.save(entity);
        return partido;
    }

    @Override
    public Optional<Partido> findByPartidoId(UUID id) {
        return partidoRepo.findById(id).map(this::mapPartidoToDomain);
    }

    @Override
    public List<Partido> findByTorneoIdAsList(UUID torneoId) {
        return partidoRepo.findByTorneoId(torneoId).stream().map(this::mapPartidoToDomain).collect(Collectors.toList());
    }

    @Override
    public void saveAll(List<Partido> partidos) {
        List<PartidoEntity> entities = partidos.stream()
                .map(p -> new PartidoEntity(p.getId(), p.getTorneoId(), p.getEquipoLocalId(), p.getEquipoVisitanteId(),
                        p.getJornada(), p.getFechaProgramada(), p.getGolesLocal(), p.getGolesVisitante(),
                        p.getResultado()))
                .collect(Collectors.toList());
        partidoRepo.saveAll(entities);
    }

    // --- Mapping Helpers ---
    private Torneo mapToDomain(TorneoEntity e) {
        return new Torneo(e.getId(), e.getNombre(), e.getEstado(), e.getMaxJugadoresPorEquipo(), e.getPuntosVictoria(),
                e.getPuntosEmpate(), e.getPuntosDerrota());
    }

    private Partido mapPartidoToDomain(PartidoEntity e) {
        return new Partido(e.getId(), e.getTorneoId(), e.getEquipoLocalId(), e.getEquipoVisitanteId(), e.getJornada(),
                e.getFechaProgramada(), e.getGolesLocal(), e.getGolesVisitante(), e.getResultado());
    }
}
