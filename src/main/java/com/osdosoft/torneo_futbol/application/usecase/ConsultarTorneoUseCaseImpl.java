package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.model.Torneo;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarTorneoUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.TorneoRepositoryPort;
import java.util.List;
import java.util.UUID;

public class ConsultarTorneoUseCaseImpl implements ConsultarTorneoUseCase {

    private final TorneoRepositoryPort torneoRepository;
    private final PartidoRepositoryPort partidoRepository;

    public ConsultarTorneoUseCaseImpl(TorneoRepositoryPort torneoRepository, PartidoRepositoryPort partidoRepository) {
        this.torneoRepository = torneoRepository;
        this.partidoRepository = partidoRepository;
    }

    @Override
    public Torneo getTorneo(UUID id) {
        return torneoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado"));
    }

    @Override
    public List<Torneo> getAllTorneos() {
        return torneoRepository.findAll();
    }

    @Override
    public List<Partido> getPartidos(UUID torneoId) {
        return partidoRepository.findByTorneoIdAsList(torneoId);
    }
}
