package com.vitalmedic.VitalMedic.domain.dto.doctor;


import jakarta.validation.constraints.NotBlank;

public record DoctorUpdateDTO(
        @NotBlank String firstName,
        @NotBlank String lastName,
        String specialty,
        String licenseNumber,
        String experience,
        String phone
) {}
