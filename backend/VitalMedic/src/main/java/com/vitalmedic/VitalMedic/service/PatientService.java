package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.patient.*;
import com.vitalmedic.VitalMedic.domain.enums.OnboardingStatus;

public interface PatientService {

    OnbordingIdentifierResponse addIdentifierAndSearchInFhir(OnbordingIdentifierRequest request);

    OnboardingProfileResponse updatePatientProfile(OnboardingProfileRequest request);

    OnboardingImportResponse importPatientData(OnboardingImportRequest request);

    OnboardingStatusResponse getOnbordingStatus();
}
