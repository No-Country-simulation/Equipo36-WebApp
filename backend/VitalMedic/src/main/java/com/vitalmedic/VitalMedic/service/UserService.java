package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.keycloak.PayloadDto;

public interface UserService {

    void create(PayloadDto payload);
}
