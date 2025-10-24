package com.vitalmedic.VitalMedic.domain.dto.appointment;

import com.vitalmedic.VitalMedic.domain.enums.AppointmentType;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentRequest(
        UUID doctorId,
        LocalDate date,
        LocalTime startTime,
        AppointmentType type
) {}
