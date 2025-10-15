package com.vitalmedic.VitalMedic.domain.dto.fhir;

import com.vitalmedic.VitalMedic.domain.enums.Gender;

import java.time.LocalDate;

public record PatientFhirResponse(
        String fhirId,
        String firstName,
        String lastName,
        LocalDate birthDate,
        Gender gender,
        String phone,
        String email,
        String address
) {}
