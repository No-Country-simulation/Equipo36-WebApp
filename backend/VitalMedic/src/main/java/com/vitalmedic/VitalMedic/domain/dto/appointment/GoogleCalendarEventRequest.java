package com.vitalmedic.VitalMedic.domain.dto.appointment;


import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoogleCalendarEventRequest {
    private DoctorEntity doctor;
    private PatientEntity patient;
    private AppointmentEntity appointment;
    private String accessToken;
}
