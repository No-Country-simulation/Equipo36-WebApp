package com.vitalmedic.VitalMedic.domain.dto.fhir;

import com.vitalmedic.VitalMedic.domain.enums.Gender;

import java.time.LocalDate;
import java.util.List;

public record PatientFhirRequest(
        String fhirId,
        String firstName,
        String lastName,
        LocalDate birthDate,
        Gender gender,
        String phone,
        String email,
        String address,
        List<PatientIdentifierDto> identifiers,
        BloodTypeObservationDto bloodType,
        List<ConditionDto> conditions,
        List<AllergyDto> allergies
) {







}
