package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.ApiResult;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentRequest;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentResponse;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentWithDoctorResponse;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentWithPatientResponse;
import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import com.vitalmedic.VitalMedic.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Tag(name = "Citas")
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crea una cita medica", description = "Crea una cita medica asignada al paciente autenticado")
    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody @Valid AppointmentRequest request){
        AppointmentResponse response = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(response, "Cita reservado con exito"));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Obtener citas de un doctor por fecha", description = "Retorna todas las citas de un doctor en una fecha específica.")
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getAppointmentsByDoctorAndDate(
            @Parameter(description = "UUID del doctor", required = true)
            @PathVariable UUID doctorId,

            @Parameter(description = "Fecha de la cita en formato YYYY-MM-DD", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AppointmentWithPatientResponse> appointments =
                appointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
        return ResponseEntity.ok(appointments);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Obtener citas de un paciente por fecha", description = "Retorna todas las citas de un doctor en una fecha específica.")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getAppointmentsByPacienteAndDate(
            @Parameter(description = "UUID del doctor", required = true)
            @PathVariable UUID patientId,

            @Parameter(description = "Fecha de la cita en formato YYYY-MM-DD", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AppointmentWithDoctorResponse> appointments =
                appointmentService.getAppointmentsByPatientAndDate(patientId, date);
        return ResponseEntity.ok(appointments);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        AppointmentResponse updated = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(ApiResult.success(updated,"Actualización de estado exitosa"));
    }

}
