package com.osdosoft.torneo_futbol.domain.model;

import java.util.UUID;

public class Usuario {
    private final UUID id;
    private final String username;
    private final String password; // Encriptada
    private final String email;
    private final Rol rol;
    private final UUID equipoId; // Null si no es delegado de equipo

    public Usuario(UUID id, String username, String password, String email, Rol rol, UUID equipoId) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.rol = rol;
        this.equipoId = equipoId;
    }

    public UUID getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public Rol getRol() {
        return rol;
    }

    public UUID getEquipoId() {
        return equipoId;
    }
}
