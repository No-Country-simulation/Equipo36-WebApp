package com.vitalmedic.VitalMedic.domain.dto.admin;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String email,
        String role
) {

}
