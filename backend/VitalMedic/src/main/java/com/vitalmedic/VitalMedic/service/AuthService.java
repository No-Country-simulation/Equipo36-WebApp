package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.entity.User;

public interface AuthService {
    String getAccessToken();

    String getCurrentUserKeycloakId();

    User getAuthenticatedUser();
}
