package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorUpdateDTO;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.Specialty;
import com.vitalmedic.VitalMedic.domain.mapper.DoctorMapper;
import com.vitalmedic.VitalMedic.exception.ResourceNotFoundException;
import com.vitalmedic.VitalMedic.repository.DoctorRepository;
import com.vitalmedic.VitalMedic.repository.SpecialtyRepository;
import com.vitalmedic.VitalMedic.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    private final SpecialtyRepository specialtyRepository;

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
    public DoctorEntity updateDoctor(UUID id, DoctorUpdateDTO dto) {
        DoctorEntity existingDoctor = getDoctorById(id);
        // 🧠 Aquí usamos MapStruct en lugar de setters manuales
        doctorMapper.updateDoctorFromDto(dto, existingDoctor);

        Specialty specialty = specialtyRepository.findById(dto.specialty())
                .orElseThrow(()->new ResourceNotFoundException("Especialidad con id "+ dto.specialty() + " no encontrado"));
        existingDoctor.setSpecialty(specialty);

        return doctorRepository.save(existingDoctor);
    }

    @Override
    public void deleteDoctor(UUID id) {
        DoctorEntity doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
    }
}
