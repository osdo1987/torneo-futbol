package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.EventoPartido;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.model.enums.TipoEventoPartido;
import com.osdosoft.torneo_futbol.domain.port.in.RegistrarEventoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.EventoPartidoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.MaterializadorEstadisticasPort;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public class RegistrarEventoUseCaseImpl implements RegistrarEventoUseCase {

    private final EventoPartidoRepositoryPort eventoRepository;
    private final PartidoRepositoryPort partidoRepository;
    private final MaterializadorEstadisticasPort materializadorEstadisticas;

    public RegistrarEventoUseCaseImpl(EventoPartidoRepositoryPort eventoRepository,
            PartidoRepositoryPort partidoRepository,
            MaterializadorEstadisticasPort materializadorEstadisticas) {
        this.eventoRepository = eventoRepository;
        this.partidoRepository = partidoRepository;
        this.materializadorEstadisticas = materializadorEstadisticas;
    }

    @Override
    @Transactional
    public void ejecutar(UUID partidoId, UUID jugadorId, TipoEventoPartido tipo, int minuto, String descripcion) {
        // 1. Validar existencia del partido
        Partido partido = partidoRepository.findByPartidoId(partidoId)
                .orElseThrow(() -> new IllegalArgumentException("Partido no encontrado"));

        // 2. Crear y guardar el evento
        EventoPartido evento = new EventoPartido(
                UUID.randomUUID(),
                partidoId,
                jugadorId,
                tipo,
                minuto,
                descripcion);
        eventoRepository.save(evento);

        // 3. Si el evento afecta el marcador, podríamos actualizar el objeto Partido
        // aquí
        // o dejar que el materializador lo haga. Por ahora, gatillamos el
        // materializador.

        // 4. Gatillar actualización/materialización de estadísticas para el torneo
        materializadorEstadisticas.recalcularEstadisticas(partido.getTorneoId());
    }
}
