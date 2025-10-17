package com.vitalmedic.VitalMedic.domain.dto.doctor;

import java.util.UUID;

public record DoctorResponseDTO(
        UUID id,
        String firstName,
        String lastName,
        String specialty,
        String licenseNumber,
        String experience,
        String phone,
        String email
) {}