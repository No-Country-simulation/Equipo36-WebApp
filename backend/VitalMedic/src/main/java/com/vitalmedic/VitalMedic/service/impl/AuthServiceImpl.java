package com.vitalmedic.VitalMedic.service.impl;


import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.exception.ResourceNotFoundException;
import com.vitalmedic.VitalMedic.repository.UserRepository;
import com.vitalmedic.VitalMedic.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public String getCurrentUserKeycloakId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new ResourceNotFoundException("Usuario no autenticado");
        }

        return jwt.getSubject();
    }

    @Override
    public User getAuthenticatedUser() {
        String keycloakIdStr = getCurrentUserKeycloakId();
        UUID keycloakId = UUID.fromString(keycloakIdStr);
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
