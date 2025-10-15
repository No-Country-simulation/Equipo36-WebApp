package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirRequest;
import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirResponse;
import com.vitalmedic.VitalMedic.domain.enums.IdentifierSystem;
import org.hl7.fhir.r4.model.*;

import java.util.List;
import java.util.Optional;

public interface FhirPatientService {
    String createPatient(PatientFhirRequest patientFhirRequest);

    Optional<PatientFhirResponse> findPatientByIdentifier(IdentifierSystem system, String value);

    Optional<Patient> getPatientByFhirId(String fhirId);

    List<Condition> getConditionsByFhirId(String fhirId);

    List<AllergyIntolerance> getAllergiesByFhirId(String fhirId);

    List<Observation> getObservationsByFhirId(String fhirId);

    List<MedicationStatement> getMedicationsByFhirId(String fhirId);

    String updatePatient(String fhirId, PatientFhirRequest patientFhirRequest);
}
