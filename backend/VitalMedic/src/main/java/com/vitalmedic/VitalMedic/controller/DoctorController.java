package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterUserRequest;
import com.vitalmedic.VitalMedic.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorRegistrationService;


}

