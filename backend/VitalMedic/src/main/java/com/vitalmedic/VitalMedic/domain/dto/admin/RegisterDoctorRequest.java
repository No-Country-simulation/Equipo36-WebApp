package com.vitalmedic.VitalMedic.domain.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(
        name = "Admin.RegisterDoctorRequest",
        description = "Petición utilizada por un administrador para registrar un nuevo doctor en el sistema.",
        requiredProperties = {"email", "firstName", "lastName", "specialty", "licenseNumber"}
)
public record RegisterDoctorRequest(

        @Schema(description = "Correo electrónico del doctor. Debe tener un formato válido.", example = "john.doe@example.com")
        @Email(message = "El email debe tener formato válido")
        @NotBlank(message = "El email es requerido")
        String email,

        @Schema(description = "Nombre(s) del doctor. Solo se permiten letras (incluye acentos) y espacios.", example = "John")
        @NotBlank(message = "El nombre es requerido")
        @Pattern(regexp = "^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$", message = "El nombre contiene caracteres no permitidos")
        String firstName,

        @Schema(description = "Apellido(s) del doctor. Solo se permiten letras (incluye acentos) y espacios.", example = "Doe")
        @NotBlank(message = "El apellido es requerido")
        @Pattern(regexp = "^[A-Za-zñáéíóúÁÉÍÓÚ]+(?: [A-Za-zñáéíóúÁÉÍÓÚ]+)*$", message = "El apellido contiene caracteres no permitidos")
        String lastName,

        @Schema(description = "Especialidad médica del doctor.", example = "Cardiología")
        @NotBlank(message = "La especialidad es requerida")
        String specialty,

        @Schema(description = "Número de licencia médica profesional del doctor.", example = "MED-123456")
        @NotBlank(message = "El número de licencia es requerido")
        String licenseNumber,

        @Schema(description = "Años de experiencia profesional del doctor (opcional).", example = "10 años")
        String experience,

        @Schema(description = "Número de teléfono de contacto del doctor (opcional).", example = "+52 55 1234 5678")
        String phone
) {
}
