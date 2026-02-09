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

        // Cross-seeding pairing: 1 vs Last, 2 vs Second to last
        // This rewarding the top teams with the "easier" match-ups
        int left = 0;
        int right = equiposIds.size() - 1;

        while (left < right) {
            partidos.add(new Partido(
                    UUID.randomUUID(),
                    fase.getTorneoId(),
                    equiposIds.get(left),
                    equiposIds.get(right),
                    1));
            left++;
            right--;
        }

        return partidos;
    }
}
