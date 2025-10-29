package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.appointment.AvailableDateResponse;
import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorAvailabilityResponse;
import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorAvalilableDates;
import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorSlotResponse;
import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorUpdateDTO;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface DoctorService {

    DoctorEntity createDoctor(DoctorEntity doctor);

    DoctorEntity getDoctorById(UUID id);

    List<DoctorEntity> getAllDoctors();

    DoctorEntity updateDoctor(UUID id, DoctorUpdateDTO dto);

    void deleteDoctor(UUID id);

    DoctorAvailabilityResponse getDoctorAvailability(UUID doctorId, LocalDate date);

    Object getDoctorsBySpecialty(Long id);

    List<AvailableDateResponse> getAvailableDates(UUID doctorId, int daysAhead);
}
