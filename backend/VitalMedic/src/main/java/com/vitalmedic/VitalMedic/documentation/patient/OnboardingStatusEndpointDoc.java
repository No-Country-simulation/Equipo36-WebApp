package com.vitalmedic.VitalMedic.documentation.patient;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Consultar el estado del onboarding del paciente",
        description = """
        Este endpoint devuelve el estado actual del flujo de onboarding del paciente autenticado.  
        
        Posibles estados:
        - `PENDING_IDENTIFIER`
        - `IMPORT_PROMPT`
        - `MANUAL_ENTRY`
        - `COMPLETED`
        """,
        security = @SecurityRequirement(name = "bearerAuth")
)
@ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Estado obtenido correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                            {
                              "status": "success",
                              "message": "Petición exitosa",
                              "data": {
                                "status": "IMPORT_PROMPT"
                              }
                            }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "Usuario no autenticado",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                            {
                              "status": "error",
                              "message": "Usuario no autenticado"
                            }
                        """)
                )
        )
})
public @interface OnboardingStatusEndpointDoc { }
