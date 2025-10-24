package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.ApiResult;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorScheduleRequest;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorScheduleResponse;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorSchedulesRequest;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorSchedulesResponse;
import com.vitalmedic.VitalMedic.service.DoctorScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Horario Doctor")
@RestController
@RequestMapping("/api/doctors/{doctorId}/schedules")
@RequiredArgsConstructor
public class DoctorScheduleController {

    private final DoctorScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<?> getDoctorSchedules(@PathVariable UUID doctorId) {
        DoctorSchedulesResponse response = scheduleService.getDoctorSchedules(doctorId);
        return ResponseEntity.ok(ApiResult.success(response,"Resultados Obtenidos"));
    }

    @PostMapping
    public ResponseEntity<?> createDoctorSchedule(@PathVariable UUID doctorId, @RequestBody @Valid DoctorSchedulesRequest request){
        DoctorSchedulesResponse response = scheduleService.createDoctorSchedules(doctorId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(response, "Horario asignado con exito"));
    }

    @PutMapping
    @Operation(summary = "Actualizar horarios", description = "Reemplaza todos los horarios del doctor por los nuevos, validando que no se solapen con los existentes.")
    public ResponseEntity<?> updateDoctorSchedules(@PathVariable UUID doctorId, @Valid @RequestBody DoctorSchedulesRequest request) {
        DoctorSchedulesResponse response = scheduleService.updateDoctorSchedules(doctorId, request);
        return ResponseEntity.ok(ApiResult.success(response,"Horario actualizado con exito"));
    }


}
