package com.vitalmedic.VitalMedic.domain.dto.doctorSchedule;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record TimeBlockRequest(
        @Schema(description = "Hora de inicio del bloque", example = "09:00")
        @NotNull(message = "La hora de inicio es obligatoria")
        LocalTime startTime,

        @Schema(description = "Hora de fin del bloque", example = "14:00")
        @NotNull(message = "La hora de fin es obligatoria")
        LocalTime endTime
) {
}
