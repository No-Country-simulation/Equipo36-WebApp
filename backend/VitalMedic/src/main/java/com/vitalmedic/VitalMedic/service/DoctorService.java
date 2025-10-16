package com.vitalmedic.VitalMedic.service;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;

import java.util.List;
import java.util.UUID;
public interface DoctorService {
    DoctorEntity createDoctor(DoctorEntity doctor);
    DoctorEntity getDoctorById(UUID id);
    List<DoctorEntity> getAllDoctors();
    DoctorEntity updateDoctor(UUID id, DoctorEntity doctor);
    void deleteDoctor(UUID id);
}
