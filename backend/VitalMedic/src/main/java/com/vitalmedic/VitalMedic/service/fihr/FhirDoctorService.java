package com.vitalmedic.VitalMedic.service.fihr;

import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;

public interface FhirDoctorService {
    String syncDoctorWithFhir(DoctorEntity doctor);
}
