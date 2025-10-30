package com.vitalmedic.VitalMedic.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.Bundle;
import com.vitalmedic.VitalMedic.service.AuthService;

@RestController
@RequestMapping("/api/clinical-history")
@RequiredArgsConstructor
public class ClinicalRecordController {

    private final IGenericClient fhirClient;
    private final AuthService authService;

    // 🧍 Paciente consulta su historial
    @GetMapping("/patient")
    public ResponseEntity<?> getPatientHistory() {
        String patientFhirId = authService.getCurrentUserKeycloakId();

        Bundle bundle = fhirClient
                .search()
                .forResource(Encounter.class)
                .where(Encounter.SUBJECT.hasId("Patient/" + patientFhirId))
                .returnBundle(Bundle.class)
                .execute();

        return ResponseEntity.ok(bundle);
    }

    // 👩‍⚕️ Médico consulta historial de un paciente
    @GetMapping("/doctor/{patientFhirId}")
    public ResponseEntity<?> getPatientHistoryForDoctor(@PathVariable String patientFhirId) {
        Bundle bundle = fhirClient
                .search()
                .forResource(Encounter.class)
                .where(Encounter.SUBJECT.hasId("Patient/" + patientFhirId))
                .returnBundle(Bundle.class)
                .execute();

        return ResponseEntity.ok(bundle);
    }
}
