package com.vitalmedic.VitalMedic.service;

import org.hl7.fhir.r4.model.Patient;

import java.util.Optional;

public interface FhirPatientService {
    String createPatient(String firstName, String lastName, String email, String phone);

    Optional<Patient> findPatientByIdentifier(String system, String value);

    Optional<Patient> getPatientById(String fhirId);

    String updatePatient(String fhirId, Patient updatedPatient);
}
