package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorSchedulesRequest;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorSchedulesResponse;

import java.util.UUID;

public interface DoctorScheduleService {
    DoctorSchedulesResponse getDoctorSchedules(UUID doctorId);

    DoctorSchedulesResponse createDoctorSchedules(UUID doctorId, DoctorSchedulesRequest request);

    DoctorSchedulesResponse updateDoctorSchedules(UUID doctorId, DoctorSchedulesRequest request);
}
