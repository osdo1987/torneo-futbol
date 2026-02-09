package com.osdosoft.torneo_futbol.domain.port.out;

import com.osdosoft.torneo_futbol.domain.model.Usuario;
import java.util.Optional;

public interface UsuarioRepositoryPort {
    Optional<Usuario> findByUsername(String username);

    Usuario save(Usuario usuario);
}
