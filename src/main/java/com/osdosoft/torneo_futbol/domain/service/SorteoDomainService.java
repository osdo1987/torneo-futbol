package com.osdosoft.torneo_futbol.domain.service;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class SorteoDomainService {

    public List<Partido> generarFixture(UUID torneoId, List<Equipo> equipos) {
        List<Partido> partidos = new ArrayList<>();
        int numEquipos = equipos.size();

        // If odd number of teams, add a "dummy" team for bye (not implemented here for
        // simplicity, assuming even or handling purely via algorithm)
        // For MVP, if odd, one team rests each round.

        if (numEquipos < 2) {
            throw new IllegalArgumentException("Se necesitan al menos 2 equipos para sortear");
        }

        List<Equipo> listaSorteo = new ArrayList<>(equipos);
        if (numEquipos % 2 != 0) {
            listaSorteo.add(null); // Dummy team ensures even number for circular method
            numEquipos++;
        }

        int numRondas = numEquipos - 1;
        int partidosPorRonda = numEquipos / 2;

        for (int ronda = 0; ronda < numRondas; ronda++) {
            for (int i = 0; i < partidosPorRonda; i++) {
                Equipo local = listaSorteo.get(i);
                Equipo visitante = listaSorteo.get(numEquipos - 1 - i);

                if (local != null && visitante != null) {
                    // Create match
                    partidos.add(new Partido(
                            UUID.randomUUID(),
                            torneoId,
                            local.getId(),
                            visitante.getId(),
                            ronda + 1));
                }
            }

            // Rotate teams (Circle Method): fix first team, rotate others
            Equipo ultimo = listaSorteo.remove(numEquipos - 1);
            listaSorteo.add(1, ultimo);
        }

        return partidos;
    }
}
