package com.vitalmedic.VitalMedic.domain.dto.patient;

import java.time.LocalDate;
import java.util.Date;

public record OnboardingProfileResponse(
        String firstName,
        String lastName,
        LocalDate birthDate,
        String gender,
        String phone,
        String address
) {}
