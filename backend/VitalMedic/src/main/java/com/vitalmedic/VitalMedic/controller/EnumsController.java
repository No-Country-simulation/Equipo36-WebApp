package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.ApiResult;
import com.vitalmedic.VitalMedic.domain.dto.enums.AppointmentStatusResponse;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnboardingImportRequest;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnboardingImportResponse;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import com.vitalmedic.VitalMedic.domain.enums.IdentifierSystem;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name ="Enum")
@RestController
@RequestMapping("/api/enums")
@RequiredArgsConstructor
public class EnumsController {

    @GetMapping("/identifier-systems")
    public List<Map<String, String>> getIdentifierSystems() {
        return List.of(IdentifierSystem.values()).stream()
                .map(system -> Map.of(
                        "value", system.name(),
                        "displayName", system.getDisplayName()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("appointment-status")
    public ResponseEntity<List<AppointmentStatusResponse>> getAllStatuses() {
        List<AppointmentStatusResponse> statuses = Arrays.stream(AppointmentStatus.values())
                .map(status -> new AppointmentStatusResponse(status.name(), status.getLabel()))
                .toList();

        return ResponseEntity.ok(statuses);
    }
}
