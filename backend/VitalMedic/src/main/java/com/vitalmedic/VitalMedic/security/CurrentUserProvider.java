package com.vitalmedic.VitalMedic.security;

import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUserOrThrow() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(auth instanceof JwtAuthenticationToken token)) {
            throw new RuntimeException("Unauthorized");
        }
        Jwt jwt = token.getToken();
        String sub = jwt.getSubject();
        UUID keycloakId;
        try {
            keycloakId = UUID.fromString(sub);
        } catch (Exception e) {
            throw new RuntimeException("Invalid subject in token");
        }
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new RuntimeException("User not registered"));
    }
}

