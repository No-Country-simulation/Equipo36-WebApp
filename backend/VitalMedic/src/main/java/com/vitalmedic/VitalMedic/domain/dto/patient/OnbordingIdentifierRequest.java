package com.vitalmedic.VitalMedic.domain.dto.patient;

import com.vitalmedic.VitalMedic.domain.enums.IdentifierSystem;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(
        name = "Patient.OnboardingIdentifierRequest",
        description = "Petición utilizada durante el proceso de onboarding del paciente para registrar y verificar un identificador único en el sistema FHIR.",
        requiredProperties = {"system", "value"})
public record OnbordingIdentifierRequest(

        @Schema(description = "Sistema de identificación del paciente (por ejemplo: CURP, NSS, u otro identificador oficial). " +
                        "Debe coincidir con alguno de los valores permitidos en el enumerado `IdentifierSystem`.",
                example = "CURP")
        @NotNull(message = "El sistema de identificación es requerido")
        IdentifierSystem system,

        @Schema(description = "Valor del identificador único asociado al sistema seleccionado. " +
                        "Debe corresponder con el formato del identificador según su sistema (por ejemplo, CURP o NSS).",
                example = "LOMJ900501HDFRRL09")
        @NotBlank(message = "El valor del identificador es requerido")
        String value
) {
}
