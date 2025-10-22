package com.vitalmedic.VitalMedic.domain.dto.doctorSchedule;

import com.vitalmedic.VitalMedic.domain.enums.WeekDay;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Schema(description = "DTO para registrar múltiples disponibilidades semanales de un doctor con soporte de varios bloques por día")
public record DoctorSchedulesRequest(

        @NotEmpty(message = "Debe incluir al menos un bloque horario")
        List<DoctorScheduleRequest> weeklySchedules

) {}
