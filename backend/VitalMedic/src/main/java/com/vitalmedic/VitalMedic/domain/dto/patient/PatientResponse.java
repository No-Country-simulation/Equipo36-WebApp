package com.vitalmedic.VitalMedic.domain.dto.patient;

import com.vitalmedic.VitalMedic.domain.enums.Gender;

import java.util.UUID;

public record PatientResponse(
        UUID id,
        String firstName,
        String lastName,
        String birthDate,
        Gender gender,
        String phone,
        String address
) {
}
