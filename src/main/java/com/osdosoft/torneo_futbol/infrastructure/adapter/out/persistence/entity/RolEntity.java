package com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity;

import com.osdosoft.torneo_futbol.domain.model.enums.Permiso;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class RolEntity {
    @Id
    private UUID id;

    @Column(unique = true, nullable = false)
    private String nombre;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "rol_permisos", joinColumns = @JoinColumn(name = "rol_id"))
    @Enumerated(EnumType.STRING)
    private Set<Permiso> permisos;
}
