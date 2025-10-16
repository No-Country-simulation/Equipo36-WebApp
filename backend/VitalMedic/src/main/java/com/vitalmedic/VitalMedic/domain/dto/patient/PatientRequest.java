package com.vitalmedic.VitalMedic.domain.dto.patient;

import com.vitalmedic.VitalMedic.domain.enums.Gender;

public record PatientRequest(
        String firstName,
        String lastName,
        String birthDate,
        Gender gender,
        String phone,
        String address
) {

}
