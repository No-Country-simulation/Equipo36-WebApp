package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorMapper {

    @Mapping(target = "id", ignore = true)   // el ID se generará
    @Mapping(target = "user", ignore = true)
    Doctor toDoctor(RegisterDoctorRequest request);
}
