package com.vitalmedic.VitalMedic.service;


import com.vitalmedic.VitalMedic.domain.dto.specialty.SpecialtyRequest;
import com.vitalmedic.VitalMedic.domain.dto.specialty.SpecialtyResponse;

import java.util.List;

public interface SpecialtyService {
    List<SpecialtyResponse> getAllSpecialty();

    SpecialtyResponse getSpecialtyById(Long id);

    SpecialtyResponse creatSpecialty(SpecialtyRequest request);

    SpecialtyResponse updateSpecialty(Long id, SpecialtyRequest request);
}
