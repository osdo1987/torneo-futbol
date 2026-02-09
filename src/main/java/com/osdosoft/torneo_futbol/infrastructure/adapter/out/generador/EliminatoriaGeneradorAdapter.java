package com.osdosoft.torneo_futbol.infrastructure.adapter.out.generador;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.port.out.GeneradorFasesPort;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class EliminatoriaGeneradorAdapter implements GeneradorFasesPort {

    @Override
    public List<Partido> generarPartidos(Fase fase, List<UUID> equiposIds) {
        List<Partido> partidos = new ArrayList<>();

        // Simple pairing: 1 vs 2, 3 vs 4, etc.
        // Assuming the list is already sorted by a seeding rule or randomly shuffled
        for (int i = 0; i < equiposIds.size() - 1; i += 2) {
            partidos.add(new Partido(
                    UUID.randomUUID(),
                    fase.getTorneoId(),
                    equiposIds.get(i),
                    equiposIds.get(i + 1),
                    1 // In elimination, jornada is usually the round (reusing the field)
            ));
        }

        return partidos;
    }
}
