package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.keycloak.PayloadDto;
import jakarta.transaction.Transactional;

public interface UserService {

    void syncUserFromKeycloak(PayloadDto payload);
}
