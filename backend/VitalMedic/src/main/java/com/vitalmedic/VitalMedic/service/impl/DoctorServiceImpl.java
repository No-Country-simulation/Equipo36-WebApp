package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.repository.DoctorRepository;
import com.vitalmedic.VitalMedic.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public DoctorEntity createDoctor(DoctorEntity doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public DoctorEntity getDoctorById(UUID id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado con id: " + id));
    }

    @Override
    public List<DoctorEntity> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public DoctorEntity updateDoctor(UUID id, DoctorEntity updatedDoctor) {
        DoctorEntity existingDoctor = getDoctorById(id);
        existingDoctor.setFirstName(updatedDoctor.getFirstName());
        existingDoctor.setLastName(updatedDoctor.getLastName());
        existingDoctor.setSpecialty(updatedDoctor.getSpecialty());
        existingDoctor.setLicenseNumber(updatedDoctor.getLicenseNumber());
        existingDoctor.setExperience(updatedDoctor.getExperience());
        existingDoctor.setPhone(updatedDoctor.getPhone());
        return doctorRepository.save(existingDoctor);
    }

    @Override
    public void deleteDoctor(UUID id) {
        DoctorEntity doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
    }


}
