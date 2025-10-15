package com.vitalmedic.VitalMedic.domain.dto.patient;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Patient.OnboardingImportRequest",
        description = "Petición para importar información del paciente durante el proceso de onboarding.",
        requiredProperties = {"importAll"})
public record OnboardingImportRequest(

        @Schema(description = "Indica si se debe importar toda la información disponible del paciente. " +
                        "Si es 'true', se importarán todos los datos relacionados automáticamente.",
                example = "true")
        @NotNull(message = "El campo 'importAll' es requerido")
        Boolean importAll
) {}
