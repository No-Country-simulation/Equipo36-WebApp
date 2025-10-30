package com.vitalmedic.VitalMedic.domain.dto.enums;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentStatusResponse {
    private String code;
    private String label;
}