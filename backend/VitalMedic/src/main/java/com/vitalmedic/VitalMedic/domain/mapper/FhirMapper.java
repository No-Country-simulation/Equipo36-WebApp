package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirResponse;
import com.vitalmedic.VitalMedic.domain.entity.*;
import com.vitalmedic.VitalMedic.domain.enums.Gender;
import com.vitalmedic.VitalMedic.repository.AllergyRepository;
import com.vitalmedic.VitalMedic.repository.ConditionRepository;
import com.vitalmedic.VitalMedic.repository.MedicationRepository;
import com.vitalmedic.VitalMedic.repository.ObservationRepository;
import lombok.RequiredArgsConstructor;
import org.hl7.fhir.r4.model.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FhirMapper {

    private final ConditionRepository conditionRepository;
    private final AllergyRepository allergyRepository;
    private final ObservationRepository observationRepository;
    private final MedicationRepository medicationRepository;


    public PatientFhirResponse toPatientDto(Patient patient) {
        HumanName name = patient.hasName() ? patient.getNameFirstRep() : null;

        String firstName = name != null ? name.getGivenAsSingleString() : null;
        String lastName = name != null ? name.getFamily() : null;

        String gender = patient.hasGender() ? patient.getGender().toCode() : null;

        LocalDate birthDate = null;
        if (patient.hasBirthDate()) {
            birthDate = patient.getBirthDate().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
        }

        // Buscar email y teléfono
        String email = null;
        String phone = null;
        if (patient.hasTelecom()) {
            for (ContactPoint contact : patient.getTelecom()) {
                if (contact.getSystem() == ContactPoint.ContactPointSystem.EMAIL)
                    email = contact.getValue();
                if (contact.getSystem() == ContactPoint.ContactPointSystem.PHONE)
                    phone = contact.getValue();
            }
        }

        // Dirección
        String address = patient.hasAddress() ? patient.getAddressFirstRep().getText() : null;

        return new PatientFhirResponse(
                patient.getIdElement().getIdPart(),
                firstName,
                lastName,
                birthDate,
                Gender.valueOf(gender.toUpperCase()),
                phone,
                email,
                address
        );
    }

    public void updateFromFhir(PatientEntity local, Patient fhirPatient) {

        if (fhirPatient == null) return;

        // ✅ Nombre y apellidos
        if (fhirPatient.hasName()) {
            HumanName name = fhirPatient.getNameFirstRep();
            if (name.hasGiven()) {
                local.setFirstName(name.getGivenAsSingleString());
            }
            if (name.hasFamily()) {
                local.setLastName(name.getFamily());
            }
        }

        // ✅ Fecha de nacimiento
        if (fhirPatient.hasBirthDate()) {
            LocalDate birthDate = fhirPatient.getBirthDate()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            local.setBirthDate(birthDate);
        }

        // ✅ Género (maneja valores desconocidos o no estándar)
        if (fhirPatient.hasGender()) {
            try {
                switch (fhirPatient.getGender()) {
                    case MALE -> local.setGender(Gender.MALE);
                    case FEMALE -> local.setGender(Gender.FEMALE);
                    default -> local.setGender(Gender.OTHER);
                }
            } catch (Exception e) {
                local.setGender(Gender.OTHER);
            }
        }

        // ✅ Correo y teléfono (si existen)
        String phone = null;

        if (fhirPatient.hasTelecom()) {
            for (ContactPoint contact : fhirPatient.getTelecom()) {
                if (contact.getSystem() == ContactPoint.ContactPointSystem.PHONE)
                    phone = contact.getValue();
            }
        }

        if (phone != null && !phone.isBlank()) {
            local.setPhone(phone);
        }

        // ✅ Dirección
        if (fhirPatient.hasAddress() && fhirPatient.getAddressFirstRep().hasText()) {
            local.setAddress(fhirPatient.getAddressFirstRep().getText());
        }
    }

    public void toConditionAndSave(List<Condition> fhirConditions, PatientEntity patient) {
        if (fhirConditions == null || fhirConditions.isEmpty()) return;

        for (Condition fhirCondition : fhirConditions) {
            ConditionEntity entity = new ConditionEntity();

            entity.setCode(fhirCondition.getCode().getText());
            entity.setDescription(fhirCondition.getClinicalStatus().getText());
            entity.setStartDate(fhirCondition.getOnsetDateTimeType() != null
                    ? fhirCondition.getOnsetDateTimeType().getValue()
                    : null);
            entity.setPatient(patient);

            conditionRepository.save(entity);
        }
    }

    public void toAllergyAndSave(List<AllergyIntolerance> fhirAllergies, PatientEntity patient) {
        if (fhirAllergies == null || fhirAllergies.isEmpty()) return;

        for (AllergyIntolerance allergy : fhirAllergies) {
            AllergyEntity entity = new AllergyEntity();

            entity.setSubstance(allergy.getCode().getText());
            entity.setCriticality(allergy.getCriticality() != null
                    ? allergy.getCriticality().toCode()
                    : null);
            entity.setReactionDescription(allergy.getReactionFirstRep() != null
                    ? allergy.getReactionFirstRep().getDescription()
                    : null);
            entity.setPatient(patient);

            allergyRepository.save(entity);
        }
    }

    public void toObservationsAndSave(List<Observation> fhirObservations, PatientEntity patient) {
        if (fhirObservations == null || fhirObservations.isEmpty()) return;

        for (Observation obs : fhirObservations) {
            ObservationEntity entity = new ObservationEntity();

            entity.setCode(obs.getCode().getText());
            entity.setValue(obs.hasValueQuantity()
                    ? obs.getValueQuantity().getValue().toString()
                    : null);
            entity.setUnit(obs.hasValueQuantity()
                    ? obs.getValueQuantity().getUnit()
                    : null);
            entity.setPatient(patient);

            observationRepository.save(entity);
        }
    }

    public void toMedicationAndSave(List<MedicationStatement> fhirMedications, PatientEntity patient) {
        if (fhirMedications == null || fhirMedications.isEmpty()) return;

        for (MedicationStatement med : fhirMedications) {
            MedicationEntity entity = new MedicationEntity();

            entity.setMedicationName(med.getMedicationCodeableConcept().getText());
            entity.setStatus(med.getStatus() != null ? med.getStatus().toCode() : null);
            entity.setEffectiveDate(med.hasEffectiveDateTimeType()
                    ? med.getEffectiveDateTimeType().getValue()
                    : null);
            entity.setPatient(patient);

            medicationRepository.save(entity);
        }
    }




}
