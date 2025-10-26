package com.vitalmedic.VitalMedic.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vitalmedic.VitalMedic.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfigurationSource;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui",
                                "/swagger-ui.html",
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/redoc.html",
                                "/api/admin/create-doctor",
                                "/api/specialty/**",
                                "/api/doctors/**",
                                "/api/enums/identifier-systems"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(customAuthenticationEntryPoint()) // 🔹 JWT inválido o ausente
                )
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(customAccessDeniedHandler()) // 🔹 Sin permisos
                );

        return http.build();
    }

    /**
     * Convierte los roles de Keycloak (realm_access.roles) a roles de Spring Security
     */
    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return converter;
    }

    /**
     * 🔹 Maneja errores de autenticación (401)
     *    Ejemplo: token ausente, expirado o inválido
     */
    private AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            log.warn("🔒 Error de autenticación: {}", authException.getMessage());

            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.UNAUTHORIZED.value(),
                    "INVALID_OR_MISSING_TOKEN",
                    "El token JWT es inválido, ha expirado o no fue proporcionado",
                    List.of("Autenticación fallida, por favor ingresa un token valido para acceder a este recurso"),
                    request.getRequestURI()
            );

            writeErrorResponse(response, errorResponse, HttpStatus.UNAUTHORIZED);
        };
    }

    /**
     * 🔹 Maneja errores de autorización (403)
     *    Ejemplo: usuario autenticado pero sin permisos suficientes
     */
    private AccessDeniedHandler customAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            log.warn("🚫 Acceso denegado: {}", accessDeniedException.getMessage());

            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.FORBIDDEN.value(),
                    "ACCESS_DENIED",
                    "No tienes permisos para acceder a este recurso",
                    List.of("El usuario no cuenta con los privilegios necesarios."),
                    request.getRequestURI()
            );

            writeErrorResponse(response, errorResponse, HttpStatus.FORBIDDEN);
        };
    }

    /**
     * 🔹 Escribe el objeto ErrorResponse como JSON en la respuesta
     */
    private void writeErrorResponse(HttpServletResponse response, ErrorResponse errorResponse, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
    }

}
