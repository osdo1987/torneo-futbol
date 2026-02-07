package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Equipo;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.model.enums.EstadoTorneo;
import com.osdosoft.torneo_futbol.domain.port.in.InscribirEquipoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.EquipoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.UUID;

public class InscribirEquipoUseCaseImpl implements InscribirEquipoUseCase {

    private final EquipoRepositoryPort equipoRepository;
    private final TorneoRepositoryPort torneoRepository;

    public InscribirEquipoUseCaseImpl(EquipoRepositoryPort equipoRepository, TorneoRepositoryPort torneoRepository) {
        this.equipoRepository = equipoRepository;
        this.torneoRepository = torneoRepository;
    }

    @Override
    public Equipo inscribirEquipo(UUID torneoId, String nombreEquipo, String delegadoEmail) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));

        if (torneo.getEstado() != EstadoTorneo.INSCRIPCIONES_ABIERTAS) {
            throw new IllegalStateException("Las inscripciones no estan abiertas para este torneo");
        }

        Equipo equipo = new Equipo(UUID.randomUUID(), nombreEquipo, delegadoEmail, torneoId);
        return equipoRepository.save(equipo);
    }
}
