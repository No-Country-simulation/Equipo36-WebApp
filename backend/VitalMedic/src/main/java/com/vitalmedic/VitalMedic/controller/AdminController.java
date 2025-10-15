package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.documentation.admin.CreateDoctorEndpointDoc;
import com.vitalmedic.VitalMedic.domain.dto.ApiResult;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.service.AdminService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Administrador")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @CreateDoctorEndpointDoc
    @PostMapping("/create-doctor")
    public ResponseEntity<?> createDoctor(@RequestBody @Valid RegisterDoctorRequest request) {
        adminService.createDoctor(request);
        return ResponseEntity.ok(ApiResult.success("Doctor creado con exito"));
    }

}
