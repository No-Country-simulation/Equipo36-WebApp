package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.admin.UserResponse;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.service.KeycloakAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KeycloakAuthServiceImpl implements KeycloakAuthService {

    @Value("${keycloak.auth-server-url}")
    private String keycloakUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret:}")
    private String clientSecret;

    private WebClient buildClient(String token) {
        return WebClient.builder()
                .baseUrl(keycloakUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * Crea un usuario en Keycloak sin asignarle rol.
     * La asignación de rol se realizará posteriormente cuando Keycloak dispare el evento de creación.
     */
    @Override
    public Mono<UserResponse> createUser(User user) {
        return getAccessToken()
                .flatMap(token -> {
                    WebClient client = buildClient(token);
                    return createUserInKeycloak(client, user)
                            .flatMap(userId ->
                                    assignRoleToExistingUser(userId, user.getRole().name())
                                            .then(sendPasswordSetupEmail(client, userId)) // 👈 nuevo paso
                                            .thenReturn(buildUserResponse(userId, user))
                            );
                });
    }

    /**
     * Asigna un rol a un usuario existente en Keycloak.
     * Usado desde el listener de eventos de creación de usuario.
     */
    @Override
    public Mono<Void> assignRoleToExistingUser(String keycloadId, String roleName) {
        return getAccessToken()
                .flatMap(token -> {
                    WebClient client = buildClient(token);
                    return getRole(client, roleName)
                            .flatMap(roleMap -> assignRoleToUser(client, keycloadId, roleMap));
                });
    }

    @Override
    public Mono<Void> removeRoleFromUser(String keycloakId, String roleName) {
        return getAccessToken()
                .flatMap(token -> {
                    WebClient client = buildClient(token);
                    return getRole(client, roleName)
                            .flatMap(roleMap -> client.method(org.springframework.http.HttpMethod.DELETE)
                                    .uri("/admin/realms/{realm}/users/{userId}/role-mappings/realm", realm, keycloakId)
                                    .bodyValue(new Object[]{roleMap})
                                    .retrieve()
                                    .toBodilessEntity()
                                    .then()
                            );
                });
    }

    @Override
    public Mono<Map<String, Object>> getGoogleFederatedToken(String userAccessToken) {
        return WebClient.builder()
                .baseUrl(keycloakUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + userAccessToken)
                .build()
                .get()
                .uri("/realms/{realm}/broker/google/token", realm)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .onErrorResume(error -> {
                    String message = "Error al obtener el token federado de Google: " + error.getMessage();
                    return Mono.error(new RuntimeException(message, error));
                });
    }

    // --------------------------- Métodos auxiliares --------------------------- //

    private Mono<String> createUserInKeycloak(WebClient client, User user) {
        Map<String, Object> newUser = Map.of(
                "username", user.getEmail(),
                "email", user.getEmail(),
                "enabled", true,
                "emailVerified", true,
                "requiredActions", List.of("UPDATE_PASSWORD")
        );

        return client.post()
                .uri("/admin/realms/{realm}/users", realm)
                .bodyValue(newUser)
                .retrieve()
                .toBodilessEntity()
                .flatMap(response -> getUserIdByEmail(client, user.getEmail()));
    }

    private Mono<Void> sendPasswordSetupEmail(WebClient client, String userId) {
        // Envía el correo automático de “establecer contraseña”
        return client.put()
                .uri("/admin/realms/{realm}/users/{userId}/execute-actions-email", realm, userId)
                .bodyValue(List.of("UPDATE_PASSWORD"))
                .retrieve()
                .toBodilessEntity()
                .then();
    }

    private Mono<String> generateActionLink(String userId, String action) {
        return getAccessToken()
                .flatMap(token -> WebClient.builder()
                        .baseUrl(keycloakUrl)
                        .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .build()
                        .post()
                        .uri("/admin/realms/{realm}/users/{userId}/execute-actions-email?client_id={clientId}&redirect_uri={redirectUri}", realm, userId, clientId, "https://tusitio.com/auth/complete-action")
                        .bodyValue(List.of(action))
                        .retrieve()
                        .toBodilessEntity()
                        .thenReturn("https://tusitio.com/auth/complete-action")); // o recuperar el enlace real si usas Keycloak REST v22+
    }

    private Mono<String> getUserIdByEmail(WebClient client, String email) {
        return client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/admin/realms/{realm}/users")
                        .queryParam("email", email)
                        .build(realm))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .flatMap(list -> {
                    if (list.isEmpty()) return Mono.error(new RuntimeException("Usuario no encontrado"));
                    return Mono.just((String) list.get(0).get("id"));
                });
    }

    private Mono<Map<String, Object>> getRole(WebClient client, String roleName) {
        return client.get()
                .uri("/admin/realms/{realm}/roles", realm)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .flatMap(list -> Mono.justOrEmpty(
                        list.stream()
                                .filter(r -> r.get("name").equals(roleName))
                                .findFirst()
                ).switchIfEmpty(Mono.error(new RuntimeException("Rol no encontrado: " + roleName))));
    }

    private Mono<Void> assignRoleToUser(WebClient client, String userId, Map<String, Object> roleMap) {
        return client.post()
                .uri("/admin/realms/{realm}/users/{userId}/role-mappings/realm", realm, userId)
                .bodyValue(new Object[]{roleMap})
                .retrieve()
                .toBodilessEntity()
                .then();
    }

    private UserResponse buildUserResponse(String userId, User user) {
        return new UserResponse(
                UUID.fromString(userId),
                user.getEmail(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    private Mono<String> getAccessToken() {
        return WebClient.builder()
                .baseUrl(keycloakUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build()
                .post()
                .uri("/realms/{realm}/protocol/openid-connect/token", realm)
                .bodyValue("grant_type=client_credentials&client_id=" + clientId +
                        (clientSecret != null && !clientSecret.isEmpty()
                                ? "&client_secret=" + clientSecret
                                : ""))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(response -> (String) response.get("access_token"));
    }
}
