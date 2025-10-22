package com.vitalmedic.VitalMedic.domain.dto.doctorSchedule;

import java.time.LocalTime;

public record TimeBlockResponse(
        Long id,
        LocalTime startTime,
        LocalTime endTime,
        boolean active
) {
}
