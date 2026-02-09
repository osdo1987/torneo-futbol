package com.osdosoft.torneo_futbol.infrastructure.adapter.out.generador;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.port.out.GeneradorFasesPort;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
public class RoundRobinGeneradorAdapter implements GeneradorFasesPort {

    @Override
    public List<Partido> generarPartidos(Fase fase, List<UUID> equiposIds) {
        List<UUID> teams = new ArrayList<>(equiposIds);
        if (teams.size() % 2 != 0) {
            teams.add(null); // Bye team
        }

        int numTeams = teams.size();
        int numDays = numTeams - 1;
        int halfSize = numTeams / 2;

        List<UUID> shuffledTeams = new ArrayList<>(teams);
        Collections.shuffle(shuffledTeams);

        List<Partido> partidos = new ArrayList<>();

        for (int day = 0; day < numDays; day++) {
            for (int i = 0; i < halfSize; i++) {
                UUID first = shuffledTeams.get(i);
                UUID second = shuffledTeams.get(numTeams - 1 - i);

                if (first != null && second != null) {
                    partidos.add(new Partido(
                            UUID.randomUUID(),
                            fase.getTorneoId(),
                            first,
                            second,
                            day + 1));
                }
            }
            // Rotate teams (keeping the first one fixed)
            Collections.rotate(shuffledTeams.subList(1, numTeams), 1);
        }

        return partidos;
    }
}
