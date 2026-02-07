package com.osdosoft.torneo_futbol.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EquipoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @NotBlank(message = "El email del delegado es obligatorio")
        @Email(message = "El email del delegado no es valido")
        String delegadoEmail) {
}
