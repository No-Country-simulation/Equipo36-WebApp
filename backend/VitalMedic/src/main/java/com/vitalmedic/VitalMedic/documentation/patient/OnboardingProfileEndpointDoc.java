package com.vitalmedic.VitalMedic.documentation.patient;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Completar perfil del paciente",
        description = """
        Este endpoint permite completar o actualizar el perfil básico del paciente durante el proceso de onboarding.  
        Si el paciente aún no tiene un ID FHIR, se crea uno; de lo contrario, se actualiza en el servidor FHIR.  
        
        Al finalizar este paso, el paciente cambia su estado a **COMPLETED** y se le asigna el rol `PATIENT`.
        """,
        security = @SecurityRequirement(name = "bearerAuth")
)
@ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Perfil actualizado exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                            {
                              "firstName": "Juan",
                              "lastName": "Pérez",
                              "birthDate": "1990-05-10",
                              "gender": "MALE",
                              "phone": "555-123-4567",
                              "address": "Av. Siempre Viva 123"
                            }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "El flujo de onboarding no corresponde a este paso",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Paso inválido",
                                value = """
                                    {
                                      "status": "error",
                                      "message": "No puedes realizar esta acción, tu flujo de onboarding no corresponde a este paso."
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error al conectar con FHIR",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Error FHIR",
                                value = """
                                    {
                                      "status": "error",
                                      "message": "No se pudo conectar con el servidor FHIR. Intente más tarde."
                                    }
                                """
                        )
                )
        )
})
public @interface OnboardingProfileEndpointDoc { }
