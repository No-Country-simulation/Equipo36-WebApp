package com.vitalmedic.VitalMedic.domain.dto.patient;

import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirResponse;

public record OnbordingIdentifierResponse(
        boolean foundInFhir,
        PatientFhirResponse patientFhir
) {
}
