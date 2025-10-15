package com.vitalmedic.VitalMedic.domain.dto.patient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vitalmedic.VitalMedic.domain.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Schema(
        name = "Patient.OnboardingProfileRequest",
        description = "Petición utilizada por el paciente para completar su perfil durante el proceso de onboarding.",
        requiredProperties = {"firstName", "lastName", "birthDate", "gender"}
)
public record OnboardingProfileRequest(

        @Schema(description = "Nombre(s) del paciente. Solo se permiten letras (incluye acentos) y espacios.", example = "María Fernanda")
        @NotBlank(message = "El nombre es requerido")
        @Pattern(regexp = "^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$", message = "El nombre contiene caracteres no permitidos")
        String firstName,

        @Schema(description = "Apellido(s) del paciente. Solo se permiten letras (incluye acentos) y espacios.", example = "López García")
        @NotBlank(message = "El apellido es requerido")
        @Pattern(regexp = "^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$", message = "El apellido contiene caracteres no permitidos")
        String lastName,

        @Schema(description = "Fecha de nacimiento del paciente en formato ISO (yyyy-MM-dd).", example = "1990-06-15")
        @NotNull(message = "La fecha de nacimiento es requerida")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate birthDate,

        @Schema(description = "Género del paciente. Valores permitidos: MALE, FEMALE, OTHER.", example = "FEMALE")
        @NotNull(message = "El género es requerido")
        Gender gender,

        @Schema(description = "Número de teléfono del paciente (opcional). Debe tener entre 10 y 15 dígitos.", example = "+52 55 1234 5678")
        @Pattern(regexp = "^(\\+?\\d{1,3}[- ]?)?\\d{10,15}$", message = "El número de teléfono no tiene un formato válido")
        String phone,

        @Schema(description = "Dirección del paciente (opcional). Puede incluir letras, números y signos básicos de puntuación.", example = "Av. Insurgentes Sur 1234, Col. Roma Norte, CDMX")
        @Pattern(regexp = "^[\\p{L}\\p{N}\\s,.'#-]{0,200}$", message = "La dirección contiene caracteres no permitidos o es demasiado larga")
        String address
) {
}
