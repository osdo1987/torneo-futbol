package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import com.osdosoft.torneo_futbol.domain.port.in.ConsultarFasesUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.FaseRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ConsultarFasesUseCaseImpl implements ConsultarFasesUseCase {

    private final FaseRepositoryPort faseRepository;

    public ConsultarFasesUseCaseImpl(FaseRepositoryPort faseRepository) {
        this.faseRepository = faseRepository;
    }

    @Override
    public List<Fase> listarPorTorneo(UUID torneoId) {
        return faseRepository.findByTorneoId(torneoId);
    }
}
