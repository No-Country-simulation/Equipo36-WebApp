package com.vitalmedic.VitalMedic.domain.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(
        name = "Admin.RegisterDoctorResponse",
        description = "Respuesta devuelta tras la creación exitosa de un nuevo doctor en el sistema."
)
public record RegisterDoctorResponse(

        @Schema(description = "Identificador único del doctor en el sistema.", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "Correo electrónico del doctor.", example = "john.doe@example.com")
        String email,

        @Schema(description = "Nombre(s) del doctor.", example = "John")
        String firstName,

        @Schema(description = "Apellido(s) del doctor.", example = "Doe")
        String lastName,

        @Schema(description = "Especialidad médica del doctor.", example = "Cardiología")
        String specialty,

        @Schema(description = "Número de licencia médica profesional.", example = "MED-123456")
        String licenseNumber,

        @Schema(description = "Años de experiencia profesional (si aplica).", example = "10 años")
        String experience,

        @Schema(description = "Número de teléfono de contacto (si aplica).", example = "+52 55 1234 5678")
        String phone
) {}
