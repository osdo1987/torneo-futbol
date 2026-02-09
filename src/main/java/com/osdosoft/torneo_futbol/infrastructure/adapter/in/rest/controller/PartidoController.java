package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.controller;

import com.osdosoft.torneo_futbol.domain.port.in.AutorizacionUseCase;
import com.osdosoft.torneo_futbol.domain.model.enums.Permiso;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarEventosUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.RegistrarResultadoUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.ProgramarPartidoUseCase;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.PartidoResponse;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.ProgramarPartidoRequest;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.ResultadoRequest;
import com.osdosoft.torneo_futbol.domain.port.in.RegistrarEventoUseCase;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.EventoRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/partidos")
public class PartidoController {

        private final RegistrarResultadoUseCase registrarResultadoUseCase;
        private final ConsultarTorneoUseCase consultarTorneoUseCase;
        private final ProgramarPartidoUseCase programarPartidoUseCase;
        private final RegistrarEventoUseCase registrarEventoUseCase;
        private final ConsultarEventosUseCase consultarEventosUseCase;
        private final AutorizacionUseCase autorizacionUseCase;

        public PartidoController(RegistrarResultadoUseCase registrarResultadoUseCase,
                        ConsultarTorneoUseCase consultarTorneoUseCase,
                        ProgramarPartidoUseCase programarPartidoUseCase,
                        RegistrarEventoUseCase registrarEventoUseCase,
                        ConsultarEventosUseCase consultarEventosUseCase,
                        AutorizacionUseCase autorizacionUseCase) {
                this.registrarResultadoUseCase = registrarResultadoUseCase;
                this.consultarTorneoUseCase = consultarTorneoUseCase;
                this.programarPartidoUseCase = programarPartidoUseCase;
                this.registrarEventoUseCase = registrarEventoUseCase;
                this.consultarEventosUseCase = consultarEventosUseCase;
                this.autorizacionUseCase = autorizacionUseCase;
        }

        @GetMapping("/{partidoId}/eventos")
        public ResponseEntity<List<com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.EventoResponse>> obtenerEventos(
                        @PathVariable UUID partidoId) {
                List<com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.EventoResponse> response = consultarEventosUseCase
                                .listarPorPartido(partidoId).stream()
                                .map(e -> new com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.EventoResponse(
                                                e.getId(), e.getPartidoId(), e.getJugadorId(), e.getTipo().name(),
                                                e.getMinuto(),
                                                e.getDescripcion()))
                                .collect(Collectors.toList());
                return ResponseEntity.ok(response);
        }

        @PostMapping("/{partidoId}/eventos")
        public ResponseEntity<Void> registrarEvento(@PathVariable UUID partidoId,
                        @Valid @RequestBody EventoRequest request) {
                autorizacionUseCase.validarPermiso(Permiso.PARTIDO_REGISTRAR_EVENTO);
                registrarEventoUseCase.ejecutar(partidoId, request.jugadorId(), request.tipo(), request.minuto(),
                                request.descripcion());
                return ResponseEntity.ok().build();
        }

        @GetMapping("/torneo/{torneoId}")
        public ResponseEntity<List<PartidoResponse>> listarPartidos(@PathVariable UUID torneoId) {
                List<PartidoResponse> response = consultarTorneoUseCase.getPartidos(torneoId).stream()
                                .map(this::mapPartidoResponse)
                                .collect(Collectors.toList());
                return ResponseEntity.ok(response);
        }

        @PutMapping("/{partidoId}/resultado")
        public ResponseEntity<PartidoResponse> registrarResultado(@PathVariable UUID partidoId,
                        @Valid @RequestBody ResultadoRequest request) {
                autorizacionUseCase.validarPermiso(Permiso.PARTIDO_REGISTRAR_RESULTADO);
                Partido partido = registrarResultadoUseCase.registrarResultado(partidoId, request.golesLocal(),
                                request.golesVisitante());
                return ResponseEntity.ok(mapPartidoResponse(partido));
        }

        @PutMapping("/{partidoId}/programar")
        public ResponseEntity<PartidoResponse> programarPartido(@PathVariable UUID partidoId,
                        @Valid @RequestBody ProgramarPartidoRequest request) {
                autorizacionUseCase.validarPermiso(Permiso.PARTIDO_PROGRAMAR);
                Partido partido = programarPartidoUseCase.programarPartido(partidoId, request.fechaProgramada());
                return ResponseEntity.ok(mapPartidoResponse(partido));
        }

        private PartidoResponse mapPartidoResponse(Partido partido) {
                return new PartidoResponse(partido.getId(), partido.getTorneoId(), partido.getEquipoLocalId(),
                                partido.getEquipoVisitanteId(), partido.getFechaProgramada(), partido.getGolesLocal(),
                                partido.getGolesVisitante(), partido.getResultado().name(), partido.getJornada());
        }
}
