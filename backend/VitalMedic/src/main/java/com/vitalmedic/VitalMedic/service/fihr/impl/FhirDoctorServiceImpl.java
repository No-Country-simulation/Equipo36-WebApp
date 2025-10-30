package com.vitalmedic.VitalMedic.service.fihr.impl;

import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.gclient.TokenClientParam;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.service.fihr.FhirDoctorService;
import lombok.RequiredArgsConstructor;
import org.hl7.fhir.r4.model.*;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FhirDoctorServiceImpl implements FhirDoctorService {

    private final IGenericClient fhirClient;

    @Override
    public String syncDoctorWithFhir(DoctorEntity doctor) {
        // Si ya tiene fhirId, no hacemos nada
        if (doctor.getFhirId() != null) {
            return doctor.getFhirId();
        }

        // 1️⃣ Buscar por número de licencia
        Optional<Practitioner> existing = findPractitionerByLicense(doctor.getLicenseNumber());

        if (existing.isPresent()) {
            Practitioner practitioner = existing.get();
            doctor.setFhirId(practitioner.getIdElement().getIdPart());
            return practitioner.getIdElement().getIdPart();
        }

        // 2️⃣ Si no existe, lo creamos
        Practitioner newPractitioner = new Practitioner();
        newPractitioner.addName(new HumanName()
                .setFamily(doctor.getLastName())
                .addGiven(doctor.getFirstName()));

        //Omitiremos el guardar este dato ya que se requiere un email real y evitaremos subirlo a FIHR
//        if (doctor.getUser().getEmail() != null) {
//            newPractitioner.addTelecom(new ContactPoint()
//                    .setSystem(ContactPoint.ContactPointSystem.EMAIL)
//                    .setValue(doctor.getUser().getEmail()));
//        }

        if (doctor.getPhone() != null) {
            newPractitioner.addTelecom(new ContactPoint()
                    .setSystem(ContactPoint.ContactPointSystem.PHONE)
                    .setValue(doctor.getPhone()));
        }

        newPractitioner.addIdentifier()
                .setSystem("https://vitalmedic.com/fhir/license")
                .setValue(doctor.getLicenseNumber());

        MethodOutcome outcome = fhirClient.create()
                .resource(newPractitioner)
                .execute();

        String fhirId = outcome.getId().getIdPart();
        doctor.setFhirId(fhirId);

        return fhirId;
    }

    private Optional<Practitioner> findPractitionerByLicense(String licenseNumber) {
        Bundle bundle = null;

        // Buscar primero por licencia
        if (licenseNumber != null) {
            bundle = fhirClient.search()
                    .forResource(Practitioner.class)
                    .where(new TokenClientParam("identifier")
                            .exactly().systemAndCode("https://vitalmedic.com/fhir/license", licenseNumber))
                    .returnBundle(Bundle.class)
                    .execute();
        }


        if (bundle != null && !bundle.getEntry().isEmpty()) {
            return Optional.of((Practitioner) bundle.getEntryFirstRep().getResource());
        }

        return Optional.empty();
    }
}
