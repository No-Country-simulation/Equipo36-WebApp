package com.vitalmedic.VitalMedic.service.fihr;

import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;

public interface FhirAppointmentService {
    String createAppointmentInFhir(AppointmentEntity appointment);

    void updateAppointmentFhirStatus(String fhirId, String newStatusCode);
}
