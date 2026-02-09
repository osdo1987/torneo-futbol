package com.osdosoft.torneo_futbol.application.usecase;

import com.osdosoft.torneo_futbol.domain.model.Usuario;
import com.osdosoft.torneo_futbol.domain.model.enums.Permiso;
import com.osdosoft.torneo_futbol.domain.port.in.AutorizacionUseCase;
import com.osdosoft.torneo_futbol.domain.port.out.UsuarioRepositoryPort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.UUID;

public class AutorizacionUseCaseImpl implements AutorizacionUseCase {

    private final UsuarioRepositoryPort usuarioRepository;

    public AutorizacionUseCaseImpl(UsuarioRepositoryPort usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void validarPermiso(Permiso permiso) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return;
        }

        boolean tienePermiso = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(permiso.name()));

        if (!tienePermiso) {
            throw new AccessDeniedException("No tiene el permiso requerido: " + permiso);
        }
    }

    @Override
    public void validarPropiedadEquipo(UUID equipoId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return;
        }

        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("Usuario no encontrado"));

        if (usuario.getRol().getNombre().equals("ORGANIZADOR")) {
            return;
        }

        if (usuario.getEquipoId() == null || !usuario.getEquipoId().equals(equipoId)) {
            throw new AccessDeniedException("No tiene permiso sobre este equipo");
        }
    }

    @Override
    public void validarAccesoTorneo(UUID torneoId) {
    }
}
