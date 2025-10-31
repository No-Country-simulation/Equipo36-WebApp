package com.vitalmedic.VitalMedic.documentation.keycloak;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Swagger documentation for POST /webhook endpoint used by Keycloak events.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Webhook de Keycloak: sincronización de usuarios",
        description = """
        Este endpoint recibe notificaciones (webhooks) desde Keycloak cuando ocurre un evento relevante, 
        como la **creación** de un usuario.  
        
        Cuando Keycloak envía el evento, el backend procesa el payload y sincroniza los datos 
        en la base de datos local para mantener la consistencia con el servidor de identidad.  
        
        ⚠️ Este endpoint está diseñado para ser llamado **únicamente desde Keycloak**, 
        no requiere autenticación de cliente externo.
        """,
        security = @SecurityRequirement(name = "bearerAuth"),
        tags = {"Keycloak Webhook"}
)
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Evento recibido y procesado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                        {
                                          "status": "success",
                                          "message": "Evento recibido y procesado correctamente."
                                        }
                                        """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Payload inválido o estructura JSON incorrecta",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Error de formato JSON",
                                        summary = "Cuando el cuerpo del request no cumple el formato esperado",
                                        value = """
                                                {
                                                  "status": "error",
                                                  "errorCode": "INVALID_PAYLOAD",
                                                  "message": "El formato del payload recibido no es válido.",
                                                  "details": [
                                                    "Campo 'email' es obligatorio.",
                                                    "El campo 'id' debe ser un UUID válido."
                                                  ],
                                                  "path": "/api/keycloak/webhook"
                                                }
                                                """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Acceso no autorizado: el request no proviene de Keycloak",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                        {
                                          "status": "error",
                                          "errorCode": "FORBIDDEN",
                                          "message": "Acceso denegado. Este endpoint solo puede ser llamado por Keycloak.",
                                          "path": "/api/keycloak/webhook"
                                        }
                                        """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error interno al procesar el evento",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                example = """
                                        {
                                          "status": "error",
                                          "errorCode": "INTERNAL_SERVER_ERROR",
                                          "message": "Ocurrió un error al guardar el usuario en la base de datos.",
                                          "details": ["java.lang.NullPointerException"],
                                          "path": "/api/keycloak/webhook"
                                        }
                                        """
                        )
                )
        )
})
public @interface KeycloakWebhookEndpointDoc { }
