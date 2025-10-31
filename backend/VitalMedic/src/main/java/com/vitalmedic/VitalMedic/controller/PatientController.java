package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.ApiResult;
import com.vitalmedic.VitalMedic.domain.dto.patient.OnbordingIdentifierRequest;
import com.vitalmedic.VitalMedic.service.PatientService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("onbording/identifier")
    public ResponseEntity<?> verifyIdentifier(@RequestBody @Valid OnbordingIdentifierRequest request){
        patientService.addIdentifierAndSearchInFhir(request);
        return ResponseEntity.ok().body(ApiResult.success(""));
    }

}
