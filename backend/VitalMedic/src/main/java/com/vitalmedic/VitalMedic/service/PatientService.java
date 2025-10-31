package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.patient.OnbordingIdentifierRequest;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnbordingIdentifierResponse;

public interface PatientService {

    OnbordingIdentifierResponse addIdentifierAndSearchInFhir(OnbordingIdentifierRequest request);
}
