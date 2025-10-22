package com.vitalmedic.VitalMedic.domain.dto.specialty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SpecialtyRequest(
        @NotBlank
        String name,

        @NotNull
        @Positive
        int averageDurationMinutes
) {
}
