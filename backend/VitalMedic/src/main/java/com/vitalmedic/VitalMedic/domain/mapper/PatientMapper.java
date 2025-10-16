package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.fhir.PatientFhirRequest;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnboardingProfileRequest;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnboardingProfileResponse;
import com.vitalmedic.VitalMedic.domain.dto.patient.PatientRequest;
import com.vitalmedic.VitalMedic.domain.dto.patient.PatientResponse;
import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring")
public interface PatientMapper {

    PatientEntity toPatient(OnboardingProfileRequest request);

    void updatePatientFromDto(OnboardingProfileRequest dto, @MappingTarget PatientEntity patient);

    void updatePatient(PatientRequest request, @MappingTarget PatientEntity patient);

    @Mapping(target = "bloodType", ignore = true)
    @Mapping(target = "conditions", ignore = true)
    @Mapping(target = "allergies", ignore = true)
    PatientFhirRequest toPatientDto(PatientEntity patientEntity);

    OnboardingProfileResponse toOnbordingProfileResponse(PatientEntity patientEntity);

    PatientResponse toPatientResponse(PatientEntity patient);

    default Page<PatientResponse> toPatientResponse(Page<PatientEntity> patient) {
        return patient.map(this::toPatientResponse);
    }

}
