package com.vitalmedic.VitalMedic.service;
import com.vitalmedic.VitalMedic.domain.entity.Doctor;

import java.util.List;
import java.util.UUID;
public interface DoctorService {
    Doctor createDoctor(Doctor doctor);
    Doctor getDoctorById(UUID id);
    List<Doctor> getAllDoctors();
    Doctor updateDoctor(UUID id, Doctor doctor);
    void deleteDoctor(UUID id);
}
