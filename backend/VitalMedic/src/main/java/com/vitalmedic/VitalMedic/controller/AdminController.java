package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.ApiResult;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterUserRequest;
import com.vitalmedic.VitalMedic.domain.enums.Role;
import com.vitalmedic.VitalMedic.service.AdminService;
import com.vitalmedic.VitalMedic.service.KeycloakAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/create-doctor")
    public ResponseEntity<?> createDoctor(@RequestBody @Valid RegisterDoctorRequest request) {
        adminService.createDoctor(request);
        return ResponseEntity.ok("");
    }

}
