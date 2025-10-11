package com.vitalmedic.VitalMedic.service.impl;

import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.TokenClientParam;
import com.vitalmedic.VitalMedic.service.FhirPatientService;
import lombok.RequiredArgsConstructor;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FhirPatientServiceImpl implements FhirPatientService {

    private final IGenericClient fhirClient;

    @Override
    public String createPatient(String firstName, String lastName, String email, String phone) {
        Patient patient = new Patient();

        // Nombre
        HumanName name = new HumanName();
        if (lastName != null && !lastName.isBlank()) name.setFamily(lastName);
        if (firstName != null && !firstName.isBlank()) name.addGiven(firstName);
        patient.addName(name);

        // Telecom: email
        if (email != null && !email.isBlank()) {
            ContactPoint emailContact = new ContactPoint();
            emailContact.setSystem(ContactPoint.ContactPointSystem.EMAIL);
            emailContact.setValue(email);
            emailContact.setUse(ContactPoint.ContactPointUse.HOME);
            patient.addTelecom(emailContact);
        }

        // Telecom: teléfono
        if (phone != null && !phone.isBlank()) {
            ContactPoint phoneContact = new ContactPoint();
            phoneContact.setSystem(ContactPoint.ContactPointSystem.PHONE);
            phoneContact.setValue(phone);
            phoneContact.setUse(ContactPoint.ContactPointUse.MOBILE);
            patient.addTelecom(phoneContact);
        }

        MethodOutcome outcome = fhirClient.create()
                .resource(patient)
                .prettyPrint()
                .encodedJson()
                .execute();

        IIdType id = outcome.getId();
        if (id == null || id.getValue() == null) throw new RuntimeException("FHIR server did not return an id");
        return new IdType(id.getValue()).getIdPart();
    }

    @Override
    public Optional<Patient> findPatientByIdentifier(String system, String value) {
        Bundle bundle = fhirClient.search()
                .forResource(Patient.class)
                .where(new TokenClientParam("identifier").exactly().systemAndCode(system, value))
                .returnBundle(Bundle.class)
                .execute();

        if (bundle == null || bundle.getEntry().isEmpty()) return Optional.empty();
        return Optional.of((Patient) bundle.getEntryFirstRep().getResource());
    }

    @Override
    public Optional<Patient> getPatientById(String fhirId) {
        try {
            Patient patient = fhirClient.read()
                    .resource(Patient.class)
                    .withId(fhirId)
                    .execute();
            return Optional.ofNullable(patient);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public String updatePatient(String fhirId, Patient updatedPatient) {
        updatedPatient.setId(new IdType(fhirId));
        MethodOutcome outcome = fhirClient.update()
                .resource(updatedPatient)
                .prettyPrint()
                .encodedJson()
                .execute();
        IIdType id = outcome.getId();
        return new IdType(id.getValue()).getIdPart();
    }
}
