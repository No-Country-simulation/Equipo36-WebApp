package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirRequest;
import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirResponse;
import com.vitalmedic.VitalMedic.domain.dto.patient.*;
import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import com.vitalmedic.VitalMedic.domain.entity.PatientIdentifierEntity;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.domain.enums.OnboardingStatus;
import com.vitalmedic.VitalMedic.domain.enums.Role;
import com.vitalmedic.VitalMedic.domain.mapper.FhirMapper;
import com.vitalmedic.VitalMedic.domain.mapper.PatientMapper;
import com.vitalmedic.VitalMedic.exception.FhirConnectionException;
import com.vitalmedic.VitalMedic.exception.InvalidOnboardingStepException;
import com.vitalmedic.VitalMedic.exception.ResourceAlreadyExistsException;
import com.vitalmedic.VitalMedic.exception.ResourceNotFoundException;
import com.vitalmedic.VitalMedic.repository.PatientIdentifierRepository;
import com.vitalmedic.VitalMedic.repository.PatientRepository;
import com.vitalmedic.VitalMedic.repository.UserRepository;
import com.vitalmedic.VitalMedic.service.AuthService;
import com.vitalmedic.VitalMedic.service.FhirPatientService;
import com.vitalmedic.VitalMedic.service.KeycloakAuthService;
import com.vitalmedic.VitalMedic.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientIdentifierRepository patientIdentifierRepository;
    private final PatientRepository patientRepository;

    private final FhirPatientService fhirPatientService;
    private final KeycloakAuthService keycloakAuthService;
    private final AuthService authService;

    private final UserRepository userRepository;
    private final PatientMapper patientMapper;
    private final FhirMapper fhirMapper;


    @Transactional
    @Override
    public OnbordingIdentifierResponse addIdentifierAndSearchInFhir(OnbordingIdentifierRequest request) {
        patientIdentifierRepository.findBySystemAndValue(request.system(), request.value())
                .ifPresent(identifier -> {
                    throw new ResourceAlreadyExistsException("El identificador ya está registrado");
                });

        User user = authService.getAuthenticatedUser();

        PatientEntity patientEntity = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        validateOnboardingStep(patientEntity,OnboardingStatus.PENDING_IDENTIFIER);

        patientEntity.setOnboardingStatus(OnboardingStatus.IMPORT_PROMPT);
        patientRepository.save(patientEntity);

        PatientIdentifierEntity patientIdentifierEntity = new PatientIdentifierEntity();
        patientIdentifierEntity.setPatient(patientEntity);
        patientIdentifierEntity.setSystem(request.system());
        patientIdentifierEntity.setValue(request.value());
        patientIdentifierRepository.save(patientIdentifierEntity);

        Optional<PatientFhirResponse> fhirResult;
        try {
            fhirResult = fhirPatientService.findPatientByIdentifier(request.system(), request.value());
        } catch (Exception e) {
            throw new FhirConnectionException("No se pudo conectar con el servidor FHIR. Intente más tarde.");
        }

        if (fhirResult.isEmpty()) {
            patientEntity.setOnboardingStatus(OnboardingStatus.MANUAL_ENTRY);
            patientRepository.save(patientEntity);
            return new OnbordingIdentifierResponse(false, null);
        }

        patientEntity.setOnboardingStatus(OnboardingStatus.IMPORT_PROMPT);
        patientEntity.setFhirId(fhirResult.get().fhirId());
        patientRepository.save(patientEntity);

        return new OnbordingIdentifierResponse(true, fhirResult.get());
    }

    @Override
    @Transactional
    public OnboardingProfileResponse updatePatientProfile(OnboardingProfileRequest request) {
        User user = authService.getAuthenticatedUser();

        PatientEntity patientEntity = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        validateOnboardingStep(patientEntity, OnboardingStatus.MANUAL_ENTRY);

        patientMapper.updatePatientFromDto(request, patientEntity);

        try {
            PatientFhirRequest patientFhirRequest = patientMapper.toPatientDto(patientEntity);
            String fhirId = patientEntity.getFhirId();

            if (fhirId == null && !Boolean.TRUE.equals(patientEntity.getImportedFromFhir())) {
                fhirId = fhirPatientService.createPatient(patientFhirRequest);
                patientEntity.setFhirId(fhirId);
            } else if (fhirId != null) {
                fhirPatientService.updatePatient(fhirId, patientFhirRequest);
            }

        } catch (Exception e) {
            throw new FhirConnectionException("No se pudo conectar con el servidor FHIR. Intente más tarde.");
        }

        patientEntity.setOnboardingStatus(OnboardingStatus.COMPLETED);
        patientRepository.save(patientEntity);

        user.setRole(Role.PATIENT);
        userRepository.save(user);

        keycloakAuthService.removeRoleFromUser(user.getKeycloakId().toString(),Role.ONBOARDING_PENDING.name()).block();
        keycloakAuthService.assignRoleToExistingUser(user.getKeycloakId().toString(),Role.PATIENT.name()).block();

        return patientMapper.toOnbordingProfileResponse(patientEntity);
    }

    @Override
    @Transactional
    public OnboardingImportResponse importPatientData(OnboardingImportRequest request) {
        User user = authService.getAuthenticatedUser();

        PatientEntity patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        validateOnboardingStep(patient, OnboardingStatus.IMPORT_PROMPT);

        if (request.importAll()) {
            String fhirId = patient.getFhirId();
            if (fhirId == null)
                throw new ResourceNotFoundException("El paciente no tiene asociado un FHIR ID");

            var fhirPatient = fhirPatientService.getPatientByFhirId(fhirId).orElse(null);
            var fhirConditions = fhirPatientService.getConditionsByFhirId(fhirId);
            var fhirAllergies = fhirPatientService.getAllergiesByFhirId(fhirId);
            var fhirObservations = fhirPatientService.getObservationsByFhirId(fhirId);
            var fhirMedications = fhirPatientService.getMedicationsByFhirId(fhirId);

            if (fhirPatient == null)
                throw new ResourceNotFoundException("No se encontró el paciente en el servidor FHIR");

            // Mapear y guardar datos del paciente
            fhirMapper.updateFromFhir(patient, fhirPatient);
            patient.setImportedFromFhir(true);
            fhirMapper.toConditionAndSave(fhirConditions, patient);
            fhirMapper.toAllergyAndSave(fhirAllergies, patient);
            fhirMapper.toObservationsAndSave(fhirObservations, patient);
            fhirMapper.toMedicationAndSave(fhirMedications, patient);

            // Cambiar estados
            patient.setOnboardingStatus(OnboardingStatus.COMPLETED);
            patientRepository.save(patient);

            // Cambiar rol del usuario
            user.setRole(Role.PATIENT);
            userRepository.save(user);

            keycloakAuthService.removeRoleFromUser(user.getKeycloakId().toString(),Role.ONBOARDING_PENDING.name()).block();
            keycloakAuthService.assignRoleToExistingUser(user.getKeycloakId().toString(),Role.PATIENT.name()).block();

            return new OnboardingImportResponse("Datos importados con exito");

        } else {
            patient.setImportedFromFhir(false);
            patient.setOnboardingStatus(OnboardingStatus.MANUAL_ENTRY);
            patientRepository.save(patient);

            return new OnboardingImportResponse("Respetamos tu decisión, tus datos no se han importado");
        }
    }

    @Override
    public OnboardingStatusResponse getOnbordingStatus() {
        User user = authService.getAuthenticatedUser();
        PatientEntity patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        return new OnboardingStatusResponse(patient.getOnboardingStatus().name());
    }

    @Override
    public PatientResponse getPatientById(UUID id) {
        PatientEntity patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));
        return patientMapper.toPatientResponse(patient);
    }

    @Override
    public Page<PatientResponse> getAllPatientsWithSearch(PatientSearchRequest request, Pageable pageable) {
        Page<PatientEntity> patients = patientRepository.searchPatients(request.search(),pageable);
        return patientMapper.toPatientResponse(patients);
    }

    @Override
    public PatientResponse updatePatient(PatientRequest request){
        User user = authService.getAuthenticatedUser();
        PatientEntity patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        patientMapper.updatePatient(request,patient);

        patientRepository.save(patient);

        return patientMapper.toPatientResponse(patient);
    }


    /* ---------------------- Helpers ---------------------- */
    private void validateOnboardingStep(PatientEntity patient, OnboardingStatus expected) {
        if (patient.getOnboardingStatus() != expected) {
            throw new InvalidOnboardingStepException("No puedes realizar esta acción, tu flujo de onboarding no corresponde a este paso.");
        }
    }
}
