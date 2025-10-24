package com.vitalmedic.VitalMedic.domain.dto.doctor;

import java.time.LocalDate;
import java.util.List;

public record DoctorAvalilableDates(
        List<LocalDate> dates
) {}
