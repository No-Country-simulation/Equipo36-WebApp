package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.specialty.SpecialtyRequest;
import com.vitalmedic.VitalMedic.domain.dto.specialty.SpecialtyResponse;
import com.vitalmedic.VitalMedic.domain.entity.Specialty;
import com.vitalmedic.VitalMedic.domain.mapper.SpecialtyMapper;
import com.vitalmedic.VitalMedic.exception.ResourceNotFoundException;
import com.vitalmedic.VitalMedic.repository.SpecialtyRepository;
import com.vitalmedic.VitalMedic.service.SpecialtyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecialtyServiceImpl implements SpecialtyService {

    private final SpecialtyRepository specialtyRepository;
    private final SpecialtyMapper specialtyMapper;

    @Override
    public List<SpecialtyResponse> getAllSpecialty(){
        List<Specialty> specialties = specialtyRepository.findAll();
        return specialtyMapper.toSpecialtyResponse(specialties);
    }

    @Override
    public SpecialtyResponse getSpecialtyById(Long id) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Especialidad con id "+id+ " no encontrada"));
        return specialtyMapper.toSpecialtyResponse(specialty);
    }

    @Override
    public SpecialtyResponse creatSpecialty(SpecialtyRequest request) {
        Specialty specialty = specialtyMapper.toSpecialty(request);
        specialtyRepository.save(specialty);
        return specialtyMapper.toSpecialtyResponse(specialty);

    }

    @Override
    public SpecialtyResponse updateSpecialty(Long id, SpecialtyRequest request) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Especialidad con id " +id+ " no enontrada"));

        specialtyMapper.update(request, specialty );

        specialtyRepository.save(specialty);
        return specialtyMapper.toSpecialtyResponse(specialty);
    }
}
