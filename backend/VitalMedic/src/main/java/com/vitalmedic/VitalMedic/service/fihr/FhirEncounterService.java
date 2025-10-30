package com.vitalmedic.VitalMedic.service.fihr;

public interface FhirEncounterService {
    String createEncounter(String patientFhirId, String doctorFhirId, boolean isVirtual);
}
