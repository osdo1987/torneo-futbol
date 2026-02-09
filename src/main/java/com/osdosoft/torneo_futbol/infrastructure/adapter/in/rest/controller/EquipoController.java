package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.controller;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Jugador;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarEquiposUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.InscribirEquipoUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.InscribirJugadorUseCase;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.EquipoRequest;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.EquipoResponse;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.JugadorRequest;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.JugadorResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/torneos/{torneoId}/equipos")
public class EquipoController {

    private final InscribirEquipoUseCase inscribirEquipoUseCase;
    private final InscribirJugadorUseCase inscribirJugadorUseCase;
    private final ConsultarEquiposUseCase consultarEquiposUseCase;
    private final com.osdosoft.torneo_futbol.domain.port.in.AutorizacionUseCase autorizacionUseCase;

    public EquipoController(InscribirEquipoUseCase inscribirEquipoUseCase,
            InscribirJugadorUseCase inscribirJugadorUseCase,
            ConsultarEquiposUseCase consultarEquiposUseCase,
            com.osdosoft.torneo_futbol.domain.port.in.AutorizacionUseCase autorizacionUseCase) {
        this.inscribirEquipoUseCase = inscribirEquipoUseCase;
        this.inscribirJugadorUseCase = inscribirJugadorUseCase;
        this.consultarEquiposUseCase = consultarEquiposUseCase;
        this.autorizacionUseCase = autorizacionUseCase;
    }

    @GetMapping
    public ResponseEntity<List<EquipoResponse>> listarEquipos(@PathVariable UUID torneoId) {
        List<EquipoResponse> response = consultarEquiposUseCase.listarEquipos(torneoId).stream()
                .map(this::mapEquipoResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{equipoId}/jugadores")
    public ResponseEntity<List<JugadorResponse>> listarJugadores(@PathVariable UUID equipoId) {
        List<JugadorResponse> response = consultarEquiposUseCase.listarJugadores(equipoId).stream()
                .map(this::mapJugadorResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<EquipoResponse> inscribirEquipo(@PathVariable UUID torneoId,
            @Valid @RequestBody EquipoRequest request) {
        autorizacionUseCase.validarPermiso(com.osdosoft.torneo_futbol.domain.model.enums.Permiso.EQUIPO_INSCRIBIR);
        Equipo equipo = inscribirEquipoUseCase.inscribirEquipo(torneoId, request.nombre(), request.delegadoEmail());
        return ResponseEntity.ok(mapEquipoResponse(equipo));
    }

    @PostMapping("/{equipoId}/jugadores")
    public ResponseEntity<JugadorResponse> inscribirJugador(
            @PathVariable UUID torneoId,
            @PathVariable UUID equipoId,
            @Valid @RequestBody JugadorRequest request) {
        autorizacionUseCase
                .validarPermiso(com.osdosoft.torneo_futbol.domain.model.enums.Permiso.EQUIPO_GESTIONAR_MI_PLANTILLA);
        autorizacionUseCase.validarPropiedadEquipo(equipoId);
        Jugador jugador = inscribirJugadorUseCase.inscribirJugador(equipoId, request.nombre(), request.numeroCamiseta(),
                torneoId);
        return ResponseEntity.ok(mapJugadorResponse(jugador));
    }

    private EquipoResponse mapEquipoResponse(Equipo equipo) {
        return new EquipoResponse(equipo.getId(), equipo.getNombre(), equipo.getDelegadoEmail(), equipo.getTorneoId());
    }

    private JugadorResponse mapJugadorResponse(Jugador jugador) {
        return new JugadorResponse(jugador.getId(), jugador.getNombre(), jugador.getNumeroCamiseta(),
                jugador.getEquipoId());
    }
}
