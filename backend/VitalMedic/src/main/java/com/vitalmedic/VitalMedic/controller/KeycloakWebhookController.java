package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.documentation.keycloak.KeycloakWebhookEndpointDoc;
import com.vitalmedic.VitalMedic.domain.dto.keycloak.PayloadDto;
import com.vitalmedic.VitalMedic.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Keycloak")
@RestController
@RequestMapping("/api/keycloak")
@RequiredArgsConstructor
public class KeycloakWebhookController {

    private final UserService userService;

    @KeycloakWebhookEndpointDoc
    @PostMapping("/webhook")
    public ResponseEntity<String> handleEvent(@RequestBody PayloadDto payloadDto) {
        userService.syncUserFromKeycloak(payloadDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Sincronización exitosa");
    }
}
