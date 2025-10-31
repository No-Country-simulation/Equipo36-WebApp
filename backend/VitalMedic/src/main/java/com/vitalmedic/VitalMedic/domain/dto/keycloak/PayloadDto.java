package com.vitalmedic.VitalMedic.domain.dto.keycloak;

import java.util.UUID;

public record PayloadDto(
        UUID id,
        String email,
        String username

) {
}
