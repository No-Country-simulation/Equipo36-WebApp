package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.documentation.patient.OnboardingImportEndpointDoc;
import com.vitalmedic.VitalMedic.documentation.patient.OnboardingProfileEndpointDoc;
import com.vitalmedic.VitalMedic.documentation.patient.OnboardingStatusEndpointDoc;
import com.vitalmedic.VitalMedic.documentation.patient.VerifyIdentifierEndpointDoc;
import com.vitalmedic.VitalMedic.domain.dto.ApiResult;
import com.vitalmedic.VitalMedic.domain.dto.patient.*;
import com.vitalmedic.VitalMedic.service.PatientService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Paciente")
@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @VerifyIdentifierEndpointDoc
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("onbording/identifier")
    public ResponseEntity<?> verifyIdentifier(@RequestBody @Valid OnbordingIdentifierRequest request){
        OnbordingIdentifierResponse response = patientService.addIdentifierAndSearchInFhir(request);
        return ResponseEntity.ok().
                body(ApiResult.success(response,"Identificador añadido"));
    }

    @OnboardingProfileEndpointDoc
    @PostMapping("/onboarding/profile")
    public ResponseEntity<OnboardingProfileResponse> updateProfile(@RequestBody @Valid OnboardingProfileRequest request) {
        return ResponseEntity.ok().
                body(patientService.updatePatientProfile(request));
    }

    @OnboardingImportEndpointDoc
    @PostMapping("/onboarding/import")
    public ResponseEntity<?> importFhirData(@RequestBody @Valid OnboardingImportRequest request) {
        OnboardingImportResponse response = patientService.importPatientData(request);
        return ResponseEntity.ok(ApiResult.success(response, "Petición exitosa"));
    }


    @OnboardingStatusEndpointDoc
    @GetMapping("/onboarding/status")
    public ResponseEntity<?> obordingStatus() {
        OnboardingStatusResponse response = patientService.getOnbordingStatus();
        return ResponseEntity.ok(ApiResult.success(response, "Petición exitosa"));
    }

}
