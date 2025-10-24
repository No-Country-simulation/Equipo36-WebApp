package com.vitalmedic.VitalMedic.domain.dto.doctor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record DoctorAvailabilityResponse(
        LocalDate date,
        List<DoctorSlotResponse> slots
) {}
