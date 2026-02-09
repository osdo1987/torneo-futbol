package com.osdosoft.torneo_futbol.infrastructure.config;

import com.osdosoft.torneo_futbol.domain.model.enums.Permiso;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.RolEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaRolRepository;
import com.osdosoft.torneo_futbol.infrastructure.adapter.out.persistence.repository.JpaUsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;
import java.util.UUID;

@Configuration
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    public DataInitializer(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initData(JpaRolRepository jpaRolRepository, JpaUsuarioRepository jpaUsuarioRepository) {
        return args -> {
            if (jpaRolRepository.count() == 0) {
                // Organizador
                RolEntity org = new RolEntity();
                org.setId(UUID.randomUUID());
                org.setNombre("ORGANIZADOR");
                org.setPermisos(Set.of(
                        Permiso.TORNEO_CREAR,
                        Permiso.TORNEO_EDITAR,
                        Permiso.TORNEO_GESTIONAR_ESTADO,
                        Permiso.VER_ESTADISTICAS));
                jpaRolRepository.save(org);

                // Arbitro
                RolEntity arb = new RolEntity();
                arb.setId(UUID.randomUUID());
                arb.setNombre("ARBITRO");
                arb.setPermisos(Set.of(
                        Permiso.PARTIDO_REGISTRAR_RESULTADO,
                        Permiso.PARTIDO_REGISTRAR_EVENTO,
                        Permiso.VER_ESTADISTICAS));
                jpaRolRepository.save(arb);

                // Delegado
                RolEntity del = new RolEntity();
                del.setId(UUID.randomUUID());
                del.setNombre("DELEGADO");
                del.setPermisos(Set.of(
                        Permiso.EQUIPO_INSCRIBIR,
                        Permiso.EQUIPO_GESTIONAR_MI_PLANTILLA,
                        Permiso.VER_ESTADISTICAS));
                jpaRolRepository.save(del);

                // Crear usuario admin por defecto
                if (jpaUsuarioRepository.count() == 0) {
                    UsuarioEntity admin = new UsuarioEntity();
                    admin.setId(UUID.randomUUID());
                    admin.setUsername("admin");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setEmail("admin@torneo.com");
                    admin.setRol(org);
                    jpaUsuarioRepository.save(admin);
                }
            }
        };
    }
}
