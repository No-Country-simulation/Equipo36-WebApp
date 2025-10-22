package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorResponseDTO;
import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorUpdateDTO;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorResponse;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DoctorMapper {

    // Mapeo de request de creación a entidad
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "specialty", ignore = true)
    DoctorEntity toDoctor(RegisterDoctorRequest request);

    // Mapeo de entidad a response después de crear doctor
    @Mapping(target = "specialty", source = "specialty.name")
    RegisterDoctorResponse toRegisterDoctorResponse(DoctorEntity doctor);

    //  Mapeo de entidad a DTO para retornar al frontend
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "specialty.name", target = "specialty")
    DoctorResponseDTO toDoctorResponseDTO(DoctorEntity doctor);

    // Actualizar entidad a partir del DTO de actualización
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "specialty", ignore = true)
    void updateDoctorFromDto(DoctorUpdateDTO dto, @MappingTarget DoctorEntity entity);
}
