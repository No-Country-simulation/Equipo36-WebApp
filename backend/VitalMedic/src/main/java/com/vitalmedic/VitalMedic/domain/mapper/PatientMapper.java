package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirRequest;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnboardingProfileRequest;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnboardingProfileResponse;
import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PatientMapper {

    PatientEntity toPatient(OnboardingProfileRequest request);

    void updatePatientFromDto(OnboardingProfileRequest dto, @MappingTarget PatientEntity user);

    @Mapping(target = "bloodType", ignore = true)
    @Mapping(target = "conditions", ignore = true)
    @Mapping(target = "allergies", ignore = true)
    PatientFhirRequest toPatientDto(PatientEntity patientEntity);

    OnboardingProfileResponse toOnbordingProfileResponse(PatientEntity patientEntity);

}
