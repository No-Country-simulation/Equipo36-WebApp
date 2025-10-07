package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.keycloak.PayloadDto;
import com.vitalmedic.VitalMedic.domain.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User PayloadDtoToUser(PayloadDto payloadDto);
}
