package com.vitalmedic.VitalMedic.domain.dto.fhir;

import com.vitalmedic.VitalMedic.domain.enums.IdentifierSystem;

public record PatientIdentifierDto(IdentifierSystem system, String value) {}
