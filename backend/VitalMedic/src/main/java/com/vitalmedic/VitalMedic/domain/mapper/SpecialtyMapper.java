package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.specialty.SpecialtyRequest;
import com.vitalmedic.VitalMedic.domain.dto.specialty.SpecialtyResponse;
import com.vitalmedic.VitalMedic.domain.entity.Specialty;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SpecialtyMapper {

    SpecialtyResponse toSpecialtyResponse(Specialty specialty);

    List<SpecialtyResponse> toSpecialtyResponse(List<Specialty> specialties);

    Specialty toSpecialty(SpecialtyRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(SpecialtyRequest request, @MappingTarget Specialty specialty);
}
