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

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    /**
     * Devuelve el JWT actual del usuario autenticado.
     */
    private Jwt getCurrentJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new ResourceNotFoundException("No se encontró autenticación en el contexto");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Jwt jwt)) {
            throw new ResourceNotFoundException("El token no es de tipo JWT o el usuario no está autenticado");
        }

        return jwt;
    }

    @Override
    public String getAccessToken() {
        Jwt jwt = getCurrentJwt();
        return jwt.getTokenValue();
    }

    /**
     * Devuelve el 'sub' (subject) del token, que normalmente corresponde
     * al ID del usuario en Keycloak.
     */
    @Override
    public String getCurrentUserKeycloakId() {
        Jwt jwt = getCurrentJwt();
        return jwt.getSubject();
    }

    /**
     * Devuelve el usuario autenticado buscándolo en la base de datos por su Keycloak ID.
     */
    @Override
    public User getAuthenticatedUser() {
        String keycloakIdStr = getCurrentUserKeycloakId();
        UUID keycloakId = UUID.fromString(keycloakIdStr);
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    /**
     * (Opcional) Devuelve el email del usuario autenticado desde el token.
     */
    public String getCurrentUserEmail() {
        Jwt jwt = getCurrentJwt();
        return jwt.getClaimAsString("email");
    }

    /**
     * (Opcional) Devuelve todos los claims del token por si necesitas inspeccionarlos.
     */
    public Map<String, Object> getCurrentUserClaims() {
        Jwt jwt = getCurrentJwt();
        return jwt.getClaims();
    }
}
