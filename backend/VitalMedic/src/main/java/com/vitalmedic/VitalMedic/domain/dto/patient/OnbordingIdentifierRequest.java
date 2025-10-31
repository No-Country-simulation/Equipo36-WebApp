package com.vitalmedic.VitalMedic.domain.dto.patient;

import com.vitalmedic.VitalMedic.domain.enums.IdentifierSystem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OnbordingIdentifierRequest(
        @NotNull IdentifierSystem system,
        @NotBlank String value
) {
}
