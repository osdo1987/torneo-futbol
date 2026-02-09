package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Fase;
import com.osdosoft.torneo_futbol.domain.model.Partido;
import com.osdosoft.torneo_futbol.domain.model.PosicionTabla;
import com.osdosoft.torneo_futbol.domain.model.ReglaAvance;
import com.osdosoft.torneo_futbol.domain.port.in.GenerarSiguienteFaseUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.EstadisticasPort;
import com.osdosoft.torneo_futbol.domain.port.out.FaseRepositoryPort;
import com.osdosoft.torneo_futbol.domain.port.out.GeneradorFasesPort;
import com.osdosoft.torneo_futbol.domain.port.out.PartidoRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class GenerarSiguienteFaseUseCaseImpl implements GenerarSiguienteFaseUseCase {

    private final FaseRepositoryPort faseRepository;
    private final EstadisticasPort estadisticasPort;
    private final Map<String, GeneradorFasesPort> generadores;
    private final PartidoRepositoryPort partidoRepository;

    public GenerarSiguienteFaseUseCaseImpl(FaseRepositoryPort faseRepository,
            EstadisticasPort estadisticasPort,
            Map<String, GeneradorFasesPort> generadores,
            PartidoRepositoryPort partidoRepository) {
        this.faseRepository = faseRepository;
        this.estadisticasPort = estadisticasPort;
        this.generadores = generadores;
        this.partidoRepository = partidoRepository;
    }

    @Override
    @Transactional
    public Fase ejecutar(UUID torneoId, UUID faseActualId, UUID nuevaFaseId, String nombreNuevaFase) {
        Fase faseActual = faseRepository.findById(faseActualId)
                .orElseThrow(() -> new IllegalArgumentException("Fase no encontrada"));

        if (!faseActual.isCompletada()) {
            // Aquí podríamos verificar si todos los partidos terminaron
            faseActual.marcarComoCompletada();
            faseRepository.save(faseActual);
        }

        // 1. Obtener resultados de la fase actual
        List<PosicionTabla> tabla = estadisticasPort.obtenerTablaPosiciones(faseActualId);

        // 2. Aplicar regla de avance dinámica
        // Si hay menos de 8 equipos, pasamos a los mejores 4 o 2 (siempre potencia de 2
        // para eliminatorias simples)
        int numClasificados = tabla.size() >= 8 ? 8 : (tabla.size() >= 4 ? 4 : 2);

        ReglaAvance regla = new com.osdosoft.torneo_futbol.domain.model.TopNReglaAvance(numClasificados);
        List<UUID> equiposQueAvanzan = regla.calcularEquiposQueAvanzan(faseActual, tabla);

        // 3. Crear nueva fase
        Fase nuevaFase = new Fase(
                nuevaFaseId,
                torneoId,
                nombreNuevaFase,
                faseActual.getOrden() + 1,
                com.osdosoft.torneo_futbol.domain.model.enums.TipoFase.ELIMINATORIA);

        // 4. Generar partidos usando el adaptador correspondiente
        GeneradorFasesPort generador = generadores.get("eliminatoriaGeneradorAdapter");
        List<Partido> nuevosPartidos = generador.generarPartidos(nuevaFase, equiposQueAvanzan);

        for (Partido p : nuevosPartidos) {
            nuevaFase.agregarPartido(p);
            partidoRepository.save(p);
        }

        faseRepository.save(nuevaFase);

        return nuevaFase;
    }
}
