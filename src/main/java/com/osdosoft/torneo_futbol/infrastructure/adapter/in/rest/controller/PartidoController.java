package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.controller;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.port.in.RegistrarResultadoUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.ProgramarPartidoUseCase;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.PartidoResponse;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.ProgramarPartidoRequest;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.ResultadoRequest;
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

    public PartidoController(RegistrarResultadoUseCase registrarResultadoUseCase,
            ConsultarTorneoUseCase consultarTorneoUseCase,
            ProgramarPartidoUseCase programarPartidoUseCase) {
        this.registrarResultadoUseCase = registrarResultadoUseCase;
        this.consultarTorneoUseCase = consultarTorneoUseCase;
        this.programarPartidoUseCase = programarPartidoUseCase;
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
        Partido partido = registrarResultadoUseCase.registrarResultado(partidoId, request.golesLocal(),
                request.golesVisitante());
        return ResponseEntity.ok(mapPartidoResponse(partido));
    }

    @PutMapping("/{partidoId}/programar")
    public ResponseEntity<PartidoResponse> programarPartido(@PathVariable UUID partidoId,
            @Valid @RequestBody ProgramarPartidoRequest request) {
        Partido partido = programarPartidoUseCase.programarPartido(partidoId, request.fechaProgramada());
        return ResponseEntity.ok(mapPartidoResponse(partido));
    }

    private PartidoResponse mapPartidoResponse(Partido partido) {
        return new PartidoResponse(partido.getId(), partido.getTorneoId(), partido.getEquipoLocalId(),
                partido.getEquipoVisitanteId(), partido.getFechaProgramada(), partido.getGolesLocal(),
                partido.getGolesVisitante(), partido.getResultado().name(), partido.getJornada());
    }
}
