package com.vitalmedic.VitalMedic.domain.dto.specialty;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SpecialtyResponse(
        Long id,
        String name,
        int averageDurationMinutes
) {
}
