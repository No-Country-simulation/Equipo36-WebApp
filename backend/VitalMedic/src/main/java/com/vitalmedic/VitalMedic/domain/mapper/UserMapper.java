package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterUserRequest;
import com.vitalmedic.VitalMedic.domain.dto.keycloak.PayloadDto;
import com.vitalmedic.VitalMedic.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "keycloakId", source = "id")
    User toUser(PayloadDto payloadDto);

    User toUser(RegisterDoctorRequest request);
}
