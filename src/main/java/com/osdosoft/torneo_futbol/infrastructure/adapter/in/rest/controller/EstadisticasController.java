package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.controller;

import com.osdosoft.torneo_futbol.domain.port.out.EstadisticasPort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticasController {

    private final EstadisticasPort estadisticasPort;

    public EstadisticasController(EstadisticasPort estadisticasPort) {
        this.estadisticasPort = estadisticasPort;
    }

    @GetMapping("/torneo/{torneoId}/goleadores")
    public ResponseEntity<Map<UUID, Integer>> getGoleadores(@PathVariable UUID torneoId) {
        return ResponseEntity.ok(estadisticasPort.obtenerGoleadores(torneoId));
    }

    @GetMapping("/torneo/{torneoId}/fairplay")
    public ResponseEntity<Map<UUID, Integer>> getFairPlay(@PathVariable UUID torneoId) {
        return ResponseEntity.ok(estadisticasPort.obtenerPuntosFairPlay(torneoId));
    }
}
