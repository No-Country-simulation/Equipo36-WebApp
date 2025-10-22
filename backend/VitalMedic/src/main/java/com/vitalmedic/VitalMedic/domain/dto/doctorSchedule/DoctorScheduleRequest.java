package com.vitalmedic.VitalMedic.domain.dto.doctorSchedule;

import com.vitalmedic.VitalMedic.domain.enums.WeekDay;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record DoctorScheduleRequest(
        @Schema(description = "Día de la semana", example = "MONDAY")
        @NotBlank(message = "El día de la semana es obligatorio")
        WeekDay weekDay,

        @Schema(description = "Bloques horarios disponibles en este día")
        @NotEmpty(message = "Debe incluir al menos un bloque horario")
        List<TimeBlockRequest> timeBlocks
) {}
