package com.vitalmedic.VitalMedic.domain.dto.appointment;

import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentType;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentWithPatientResponse(
        Long id,
        LocalDate date,
        LocalTime startTime,
        AppointmentType type,
        AppointmentStatus status,
        SimplePatientDto patient
) {

    public record SimplePatientDto(
            UUID id,
            String firstName,
            String lastName
    ){}
}
