package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorResponse;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    DoctorEntity toDoctor(RegisterDoctorRequest request);

    RegisterDoctorResponse toRegisterDoctorResponse(DoctorEntity doctor);
}
