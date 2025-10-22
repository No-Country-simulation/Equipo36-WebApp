package com.vitalmedic.VitalMedic.domain.dto.doctorSchedule;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Respuesta completa de los horarios del doctor")
public record DoctorSchedulesResponse(
        List<DoctorScheduleResponse> weeklySchedules
) {}