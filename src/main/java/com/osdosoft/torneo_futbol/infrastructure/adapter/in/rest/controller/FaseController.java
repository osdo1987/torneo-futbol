package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.controller;

import com.osdosoft.torneo_futbol.domain.port.in.ConsultarFasesUseCase;
import com.osdosoft.torneo_futbol.domain.port.in.GenerarSiguienteFaseUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fases")
public class FaseController {

    private final GenerarSiguienteFaseUseCase generarSiguienteFaseUseCase;
    private final ConsultarFasesUseCase consultarFasesUseCase;

    public FaseController(GenerarSiguienteFaseUseCase generarSiguienteFaseUseCase,
            ConsultarFasesUseCase consultarFasesUseCase) {
        this.generarSiguienteFaseUseCase = generarSiguienteFaseUseCase;
        this.consultarFasesUseCase = consultarFasesUseCase;
    }

    @GetMapping("/torneo/{torneoId}")
    public ResponseEntity<List<com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.FaseResponse>> listarFases(
            @PathVariable UUID torneoId) {
        List<com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.FaseResponse> response = consultarFasesUseCase
                .listarPorTorneo(torneoId).stream()
                .map(f -> new com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.FaseResponse(
                        f.getId(), f.getNombre(), f.getOrden(), f.getTipo().name(), f.isCompletada()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/torneo/{torneoId}/avanzar")
    public ResponseEntity<Void> avanzarFase(
            @PathVariable UUID torneoId,
            @RequestParam UUID faseActualId,
            @RequestParam String nombreNuevaFase) {

        // El ID de la nueva fase se genera aquí para simplificar
        UUID nuevaFaseId = UUID.randomUUID();
        generarSiguienteFaseUseCase.ejecutar(torneoId, faseActualId, nuevaFaseId, nombreNuevaFase);

        return ResponseEntity.ok().build();
    }
}
