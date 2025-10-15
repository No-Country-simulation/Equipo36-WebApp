package com.vitalmedic.VitalMedic.domain.dto.keycloak;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@Schema(name = "Keycloak.PayloadDto",
        description = "Representa la carga útil enviada por Keycloak cuando se produce un evento de usuario, como la creación de una cuenta.")
public record PayloadDto(

        @Schema(description = "Identificador único (UUID) del usuario en Keycloak.",
                example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "Correo electrónico asociado al usuario en Keycloak.", example = "user@example.com")
        String email,

        @Schema(description = "Nombre de usuario (username) del usuario en Keycloak.", example = "john_doe")
        String username
) {
}
