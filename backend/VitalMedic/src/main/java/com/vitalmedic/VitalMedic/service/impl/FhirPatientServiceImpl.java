package com.vitalmedic.VitalMedic.service.impl;

import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.TokenClientParam;
import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirRequest;
import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirResponse;
import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientIdentifierDto;
import com.vitalmedic.VitalMedic.domain.enums.IdentifierSystem;
import com.vitalmedic.VitalMedic.domain.mapper.FhirMapper;
import com.vitalmedic.VitalMedic.service.FhirPatientService;
import lombok.RequiredArgsConstructor;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.*;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FhirPatientServiceImpl implements FhirPatientService {

    private final IGenericClient fhirClient;
    private final FhirMapper fhirMapper;

    @Override
    public String createPatient(PatientFhirRequest patientFhirRequest) {
        Patient patient = new Patient();

        if (patientFhirRequest.identifiers() != null && !patientFhirRequest.identifiers().isEmpty()) {
            for (PatientIdentifierDto identifierDto : patientFhirRequest.identifiers()) {
                patient.addIdentifier()
                        .setSystem(identifierDto != null
                                ? identifierDto.system().getSystemUrl()
                                : "https://vitalmedic.com/fhir/identifiers")
                        .setValue(identifierDto.value())
                        .setUse(Identifier.IdentifierUse.OFFICIAL);

            }
        }

        // Nombre
        HumanName name = new HumanName();
        if (patientFhirRequest.lastName() != null && !patientFhirRequest.lastName().isBlank())
            name.setFamily(patientFhirRequest.lastName());
        if (patientFhirRequest.firstName() != null && !patientFhirRequest.firstName().isBlank())
            name.addGiven(patientFhirRequest.firstName());
        patient.addName(name);

        // Género
        if (patientFhirRequest.gender() != null)
            patient.setGender(Enumerations.AdministrativeGender.fromCode(patientFhirRequest.gender().name().toLowerCase()));

        // Fecha de nacimiento
        if (patientFhirRequest.birthDate() != null){
            Date date = Date.from(patientFhirRequest.birthDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
            patient.setBirthDate(date);
        }

        // Contacto (si el paciente lo autorizó)
        if (patientFhirRequest.email() != null && !patientFhirRequest.email().isBlank())
            patient.addTelecom(new ContactPoint()
                    .setSystem(ContactPoint.ContactPointSystem.EMAIL)
                    .setValue(patientFhirRequest.email())
                    .setUse(ContactPoint.ContactPointUse.HOME));

        if (patientFhirRequest.phone() != null && !patientFhirRequest.phone().isBlank())
            patient.addTelecom(new ContactPoint()
                    .setSystem(ContactPoint.ContactPointSystem.PHONE)
                    .setValue(patientFhirRequest.phone())
                    .setUse(ContactPoint.ContactPointUse.MOBILE));

        // Dirección (solo texto general)
        if (patientFhirRequest.address() != null && !patientFhirRequest.address().isBlank()) {
            Address address = new Address();
            address.setText(patientFhirRequest.address());
            patient.addAddress(address);
        }

        MethodOutcome outcome = fhirClient.create()
                .resource(patient)
                .prettyPrint()
                .encodedJson()
                .execute();

        IIdType id = outcome.getId();
        if (id == null || id.getValue() == null)
            throw new RuntimeException("El servidor FHIR no devolvió un ID válido");

        return new IdType(id.getValue()).getIdPart();
    }

    @Override
    public Optional<PatientFhirResponse> findPatientByIdentifier(IdentifierSystem system, String value) {

        Bundle bundle = fhirClient.search()
                .forResource(Patient.class)
                .where(new TokenClientParam("identifier").exactly().systemAndCode(system.getSystemUrl(), value))
                .returnBundle(Bundle.class)
                .execute();

        if (bundle == null || bundle.getEntry().isEmpty())
            return Optional.empty();

        Patient patient = (Patient) bundle.getEntryFirstRep().getResource();
        return Optional.of(fhirMapper.toPatientDto(patient));


    }

    @Override
    public Optional<Patient> getPatientByFhirId(String fhirId) {
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
    public List<Condition> getConditionsByFhirId(String fhirId) {
        try {
            Bundle bundle = fhirClient.search()
                    .forResource(Condition.class)
                    .where(Condition.PATIENT.hasId(fhirId))
                    .returnBundle(Bundle.class)
                    .execute();

            return bundle.getEntry().stream()
                    .map(Bundle.BundleEntryComponent::getResource)
                    .filter(r -> r instanceof Condition)
                    .map(r -> (Condition) r)
                    .toList();

        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public List<AllergyIntolerance> getAllergiesByFhirId(String fhirId) {
        try {
            Bundle bundle = fhirClient.search()
                    .forResource(AllergyIntolerance.class)
                    .where(AllergyIntolerance.PATIENT.hasId(fhirId))
                    .returnBundle(Bundle.class)
                    .execute();

            return bundle.getEntry().stream()
                    .map(Bundle.BundleEntryComponent::getResource)
                    .filter(r -> r instanceof AllergyIntolerance)
                    .map(r -> (AllergyIntolerance) r)
                    .toList();

        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public List<Observation> getObservationsByFhirId(String fhirId) {
        try {
            Bundle bundle = fhirClient.search()
                    .forResource(Observation.class)
                    .where(Observation.SUBJECT.hasId(fhirId))
                    .returnBundle(Bundle.class)
                    .execute();

            return bundle.getEntry().stream()
                    .map(Bundle.BundleEntryComponent::getResource)
                    .filter(r -> r instanceof Observation)
                    .map(r -> (Observation) r)
                    .toList();

        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    public List<MedicationStatement> getMedicationsByFhirId(String fhirId) {
        try {
            Bundle bundle = fhirClient.search()
                    .forResource(MedicationStatement.class)
                    .where(MedicationStatement.PATIENT.hasId(fhirId))
                    .returnBundle(Bundle.class)
                    .execute();

            return bundle.getEntry().stream()
                    .map(Bundle.BundleEntryComponent::getResource)
                    .filter(r -> r instanceof MedicationStatement)
                    .map(r -> (MedicationStatement) r)
                    .toList();

        } catch (Exception e) {
            return List.of();
        }
    }




    @Override
    public String updatePatient(String fhirId, PatientFhirRequest patientFhirRequest) {
        Patient existingPatient = fhirClient.read()
                .resource(Patient.class)
                .withId(fhirId)
                .execute();

        // Actualizar solo los campos que cambian
        if (patientFhirRequest.firstName() != null)
            existingPatient.getNameFirstRep().getGiven().clear();
        existingPatient.getNameFirstRep().addGiven(patientFhirRequest.firstName());

        if (patientFhirRequest.lastName() != null)
            existingPatient.getNameFirstRep().setFamily(patientFhirRequest.lastName());

        if (patientFhirRequest.birthDate() != null) {
            Date date = java.sql.Date.valueOf(patientFhirRequest.birthDate());
            existingPatient.setBirthDate(date);
        }


        if (patientFhirRequest.gender() != null)
            existingPatient.setGender(Enumerations.AdministrativeGender.fromCode(patientFhirRequest.gender().name().toLowerCase()));

        MethodOutcome outcome = fhirClient.update()
                .resource(existingPatient)
                .prettyPrint()
                .encodedJson()
                .execute();

        return outcome.getId().getIdPart();
    }
}
