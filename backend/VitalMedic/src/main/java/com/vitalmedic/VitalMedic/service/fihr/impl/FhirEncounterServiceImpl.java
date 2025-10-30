package com.vitalmedic.VitalMedic.service.fihr.impl;

import com.vitalmedic.VitalMedic.service.fihr.FhirEncounterService;
import lombok.RequiredArgsConstructor;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.Reference;
import org.hl7.fhir.r4.model.Coding;
import org.hl7.fhir.r4.model.Encounter.EncounterStatus;
import org.springframework.stereotype.Service;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;

@Service
@RequiredArgsConstructor
public class FhirEncounterServiceImpl implements FhirEncounterService {

    private final IGenericClient fhirClient;

    @Override
    public String createEncounter(String patientFhirId, String doctorFhirId, boolean isVirtual) {
        Encounter encounter = new Encounter();

        // Estado de la consulta
        encounter.setStatus(EncounterStatus.FINISHED);

        // Tipo de encuentro: virtual o presencial
        encounter.setClass_(new Coding()
                .setSystem("http://terminology.hl7.org/CodeSystem/v3-ActCode")
                .setCode(isVirtual ? "VR" : "AMB") // Virtual = VR, Ambulatorio = AMB
                .setDisplay(isVirtual ? "Teleconsulta" : "Consulta presencial"));

        // Asociar paciente y médico
        encounter.setSubject(new Reference("Patient/" + patientFhirId));
        encounter.addParticipant()
                .setIndividual(new Reference("Practitioner/" + doctorFhirId));

        // Registrar el encuentro en FHIR
        MethodOutcome outcome = fhirClient
                .create()
                .resource(encounter)
                .execute();

        return outcome.getId().getIdPart();
    }
}
