package com.vitalmedic.VitalMedic.domain.dto.patient;

public record OnbordingIdentifierResponse(
        boolean foundInFhir,
        org.hl7.fhir.r4.model.Patient patientFhir
) {
}
