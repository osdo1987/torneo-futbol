package com.osdosoft.torneo_futbol.domain.model;

import com.osdosoft.torneo_futbol.domain.model.enums.Permiso;
import java.util.Set;

public class Rol {
    private final String nombre;
    private final Set<Permiso> permisos;

    public Rol(String nombre, Set<Permiso> permisos) {
        this.nombre = nombre;
        this.permisos = permisos;
    }

    public String getNombre() {
        return nombre;
    }

    public Set<Permiso> getPermisos() {
        return permisos;
    }

    public boolean tienePermiso(Permiso permiso) {
        return permisos.contains(permiso);
    }
}
