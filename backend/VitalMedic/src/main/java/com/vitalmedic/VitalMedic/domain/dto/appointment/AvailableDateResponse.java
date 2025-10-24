package com.vitalmedic.VitalMedic.domain.dto.appointment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vitalmedic.VitalMedic.domain.enums.AvailabilityStatus;

import java.time.LocalDate;

public record AvailableDateResponse(
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate date,

        AvailabilityStatus status
) {

}
