package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.controller;

import com.osdosoft.torneo_futbol.domain.model.Usuario;
import com.osdosoft.torneo_futbol.domain.port.out.UsuarioRepositoryPort;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.LoginRequest;
import com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepositoryPort usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return usuarioRepository.findByUsername(request.username())
                .filter(u -> passwordEncoder.matches(request.password(), u.getPassword()))
                .map(this::mapToResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    private LoginResponse mapToResponse(Usuario u) {
        return new LoginResponse(
                u.getId(),
                u.getUsername(),
                u.getRol().getNombre(),
                u.getRol().getPermisos().stream().map(Enum::name).collect(Collectors.toSet()),
                u.getEquipoId());
    }
}
