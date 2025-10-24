package com.vitalmedic.VitalMedic.domain.dto.appointment;

import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentType;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentWithDoctorResponse(
        Long id,
        LocalDate date,
        LocalTime startTime,
        AppointmentType type,
        AppointmentStatus status,
        DoctorSimpleDto doctor
) {
    public record DoctorSimpleDto(
            UUID doctorId,
            String firstName,
            String lastName,
            String specialty
    ){}

}
