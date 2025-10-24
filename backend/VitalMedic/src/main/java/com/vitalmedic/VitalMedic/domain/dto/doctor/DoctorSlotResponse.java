package com.vitalmedic.VitalMedic.domain.dto.doctor;

import java.time.LocalTime;

public record DoctorSlotResponse(
        LocalTime startTime,
        LocalTime endTime,
        boolean available
) {

}
