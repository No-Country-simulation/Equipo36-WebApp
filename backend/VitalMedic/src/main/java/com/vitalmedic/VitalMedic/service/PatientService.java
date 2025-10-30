package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.patient.*;
import com.vitalmedic.VitalMedic.domain.enums.OnboardingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PatientService {

    OnbordingIdentifierResponse addIdentifierAndSearchInFhir(OnbordingIdentifierRequest request);

    OnboardingProfileResponse updatePatientProfile(OnboardingProfileRequest request);

    OnboardingImportResponse importPatientData(OnboardingImportRequest request);

    OnboardingStatusResponse getOnbordingStatus();

    PatientResponse getPatientById(UUID id);

    Page<PatientResponse> getAllPatientsWithSearch(PatientSearchRequest request, Pageable pageable);

    PatientResponse updatePatient(PatientRequest request);

    PatientResponse myProfile();
}
