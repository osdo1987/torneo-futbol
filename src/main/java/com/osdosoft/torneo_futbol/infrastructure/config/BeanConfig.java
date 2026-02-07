package com.osdosoft.torneo_futbol.infrastructure.config;

import com.osdosoft.torneo_futbol.application.usecase.*;
import com.osdosoft.torneo_futbol.domain.port.in.*;
import com.osdosoft.torneo_futbol.domain.port.out.*;
import com.osdosoft.torneo_futbol.domain.service.SorteoDomainService;
import com.osdosoft.torneo_futbol.domain.service.TablaPosicionesDomainService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public SorteoDomainService sorteoDomainService() {
        return new SorteoDomainService();
    }

    @Bean
    public TablaPosicionesDomainService tablaPosicionesDomainService() {
        return new TablaPosicionesDomainService();
    }

    @Bean
    public CrearTorneoUseCase crearTorneoUseCase(TorneoRepositoryPort torneoRepositoryPort) {
        return new CrearTorneoUseCaseImpl(torneoRepositoryPort);
    }

    @Bean
    public AbrirInscripcionesUseCase abrirInscripcionesUseCase(TorneoRepositoryPort torneoRepositoryPort) {
        return new AbrirInscripcionesUseCaseImpl(torneoRepositoryPort);
    }

    @Bean
    public CerrarInscripcionesUseCase cerrarInscripcionesUseCase(TorneoRepositoryPort torneoRepositoryPort) {
        return new CerrarInscripcionesUseCaseImpl(torneoRepositoryPort);
    }

    @Bean
    public FinalizarTorneoUseCase finalizarTorneoUseCase(TorneoRepositoryPort torneoRepositoryPort) {
        return new FinalizarTorneoUseCaseImpl(torneoRepositoryPort);
    }

    @Bean
    public InscribirEquipoUseCase inscribirEquipoUseCase(EquipoRepositoryPort equipoRepositoryPort,
            TorneoRepositoryPort torneoRepositoryPort) {
        return new InscribirEquipoUseCaseImpl(equipoRepositoryPort, torneoRepositoryPort);
    }

    @Bean
    public InscribirJugadorUseCase inscribirJugadorUseCase(JugadorRepositoryPort jugadorRepositoryPort,
            TorneoRepositoryPort torneoRepositoryPort, EquipoRepositoryPort equipoRepositoryPort) {
        return new InscribirJugadorUseCaseImpl(jugadorRepositoryPort, torneoRepositoryPort, equipoRepositoryPort);
    }

    @Bean
    public SorteoUseCase sorteoUseCase(TorneoRepositoryPort torneoRepo, EquipoRepositoryPort equipoRepo,
            PartidoRepositoryPort partidoRepo, SorteoDomainService sorteoService) {
        return new SorteoUseCaseImpl(torneoRepo, equipoRepo, partidoRepo, sorteoService);
    }

    @Bean
    public RegistrarResultadoUseCase registrarResultadoUseCase(PartidoRepositoryPort partidoRepo,
            TorneoRepositoryPort torneoRepo) {
        return new RegistrarResultadoUseCaseImpl(partidoRepo, torneoRepo);
    }

    @Bean
    public ProgramarPartidoUseCase programarPartidoUseCase(PartidoRepositoryPort partidoRepo) {
        return new ProgramarPartidoUseCaseImpl(partidoRepo);
    }

    @Bean
    public ConsultarTorneoUseCase consultarTorneoUseCase(TorneoRepositoryPort torneoRepo,
            PartidoRepositoryPort partidoRepo) {
        return new ConsultarTorneoUseCaseImpl(torneoRepo, partidoRepo);
    }

    @Bean
    public ObtenerTablaPosicionesUseCase obtenerTablaPosicionesUseCase(TorneoRepositoryPort torneoRepo,
            EquipoRepositoryPort equipoRepo,
            PartidoRepositoryPort partidoRepo,
            TablaPosicionesDomainService tablaService) {
        return new ObtenerTablaPosicionesUseCaseImpl(torneoRepo, equipoRepo, partidoRepo, tablaService);
    }
}
