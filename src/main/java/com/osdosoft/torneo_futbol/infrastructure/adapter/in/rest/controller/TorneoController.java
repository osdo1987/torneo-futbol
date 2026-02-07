package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.controller;

import com.osdosoft.torneo_futbol.domain.model.PosicionTabla;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.in.AbrirInscripcionesUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.CerrarInscripcionesUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.CrearTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.FinalizarTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.ObtenerTablaPosicionesUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.SorteoUseCase;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.PosicionTablaResponse;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.TorneoRequest;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.TorneoResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/torneos")
public class TorneoController {

    private final CrearTorneoUseCase crearTorneoUseCase;
    private final ConsultarTorneoUseCase consultarTorneoUseCase;
    private final SorteoUseCase sorteoUseCase;
    private final AbrirInscripcionesUseCase abrirInscripcionesUseCase;
    private final CerrarInscripcionesUseCase cerrarInscripcionesUseCase;
    private final FinalizarTorneoUseCase finalizarTorneoUseCase;
    private final ObtenerTablaPosicionesUseCase obtenerTablaPosicionesUseCase;

    public TorneoController(CrearTorneoUseCase crearTorneoUseCase,
            ConsultarTorneoUseCase consultarTorneoUseCase,
            SorteoUseCase sorteoUseCase,
            AbrirInscripcionesUseCase abrirInscripcionesUseCase,
            CerrarInscripcionesUseCase cerrarInscripcionesUseCase,
            FinalizarTorneoUseCase finalizarTorneoUseCase,
            ObtenerTablaPosicionesUseCase obtenerTablaPosicionesUseCase) {
        this.crearTorneoUseCase = crearTorneoUseCase;
        this.consultarTorneoUseCase = consultarTorneoUseCase;
        this.sorteoUseCase = sorteoUseCase;
        this.abrirInscripcionesUseCase = abrirInscripcionesUseCase;
        this.cerrarInscripcionesUseCase = cerrarInscripcionesUseCase;
        this.finalizarTorneoUseCase = finalizarTorneoUseCase;
        this.obtenerTablaPosicionesUseCase = obtenerTablaPosicionesUseCase;
    }

    @PostMapping
    public ResponseEntity<TorneoResponse> crearTorneo(@Valid @RequestBody TorneoRequest request) {
        Torneo torneo = crearTorneoUseCase.crearTorneo(
                request.nombre(),
                request.maxJugadoresPorEquipo(),
                request.puntosVictoria(),
                request.puntosEmpate(),
                request.puntosDerrota());
        return ResponseEntity.ok(mapToResponse(torneo));
    }

    @GetMapping
    public ResponseEntity<List<TorneoResponse>> listarTorneos() {
        return ResponseEntity.ok(consultarTorneoUseCase.getAllTorneos().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TorneoResponse> obtenerTorneo(@PathVariable UUID id) {
        return ResponseEntity.ok(mapToResponse(consultarTorneoUseCase.getTorneo(id)));
    }

    @PostMapping("/{id}/inscripciones/abrir")
    public ResponseEntity<TorneoResponse> abrirInscripciones(@PathVariable UUID id) {
        Torneo torneo = abrirInscripcionesUseCase.abrirInscripciones(id);
        return ResponseEntity.ok(mapToResponse(torneo));
    }

    @PostMapping("/{id}/inscripciones/cerrar")
    public ResponseEntity<TorneoResponse> cerrarInscripciones(@PathVariable UUID id) {
        Torneo torneo = cerrarInscripcionesUseCase.cerrarInscripciones(id);
        return ResponseEntity.ok(mapToResponse(torneo));
    }

    @PostMapping("/{id}/sorteo")
    public ResponseEntity<Void> ejecutarSorteo(@PathVariable UUID id) {
        sorteoUseCase.ejecutarSorteo(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/finalizar")
    public ResponseEntity<TorneoResponse> finalizarTorneo(@PathVariable UUID id) {
        Torneo torneo = finalizarTorneoUseCase.finalizarTorneo(id);
        return ResponseEntity.ok(mapToResponse(torneo));
    }

    @GetMapping("/{id}/tabla")
    public ResponseEntity<List<PosicionTablaResponse>> obtenerTabla(@PathVariable UUID id) {
        List<PosicionTablaResponse> response = obtenerTablaPosicionesUseCase.obtenerTabla(id).stream()
                .map(this::mapPosicionTabla)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private TorneoResponse mapToResponse(Torneo t) {
        return new TorneoResponse(t.getId(), t.getNombre(), t.getEstado().name(), t.getMaxJugadoresPorEquipo());
    }

    private PosicionTablaResponse mapPosicionTabla(PosicionTabla p) {
        return new PosicionTablaResponse(
                p.getEquipoId(),
                p.getNombreEquipo(),
                p.getPuntos(),
                p.getPartidosJugados(),
                p.getPartidosGanados(),
                p.getPartidosEmpatados(),
                p.getPartidosPerdidos(),
                p.getGolesFavor(),
                p.getGolesContra(),
                p.getDiferenciaGoles());
    }
}
