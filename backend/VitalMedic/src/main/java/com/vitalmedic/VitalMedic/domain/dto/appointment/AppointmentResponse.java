package com.vitalmedic.VitalMedic.domain.dto.appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentResponse(
        Long id,
        UUID doctorId,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        String status,
        String type,
        String meetLink
)
{}
