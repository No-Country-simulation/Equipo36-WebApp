package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentRequest;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentResponse;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentWithDoctorResponse;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentWithPatientResponse;
import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentService {
    AppointmentResponse createAppointment(AppointmentRequest request);

    List<AppointmentWithPatientResponse> getAppointmentsByDoctorAndDate(UUID id, LocalDate date);

    List<AppointmentWithDoctorResponse> getAppointmentsByPatientAndDate(UUID doctorId, LocalDate date);

    AppointmentResponse updateAppointmentStatus(Long appointmentId, AppointmentStatus newStatus);
}
