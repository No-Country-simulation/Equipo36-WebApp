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
        summary = "Verificar identificador del paciente",
        description = """
        Este endpoint verifica si un identificador (por ejemplo, CURP, cédula o número de seguro) 
        ya existe en el sistema FHIR o en la base de datos interna.  
        
        Si el identificador ya está registrado, se lanza un error.  
        Si no, el sistema intenta buscar el paciente en FHIR y actualiza el estado de onboarding.
        """,
        security = @SecurityRequirement(name = "bearerAuth")
)
@ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Identificador verificado correctamente",
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(example = """
                            {
                              "status": "success",
                              "message": "Identificador añadido",
                              "data": {
                                "foundInFhir": true,
                                "patientFhir": {
                                  "fhirId": "123abc",
                                  "firstName": "Juan",
                                  "lastName": "Pérez"
                                }
                              }
                            }
                        """)
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "El identificador ya está registrado",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Identificador duplicado",
                                value = """
                                    {
                                      "status": "error",
                                      "errorCode": "RESOURCE_ALREADY_EXISTS",
                                      "message": "El identificador ya está registrado."
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Error al conectar con el servidor FHIR",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Error FHIR",
                                value = """
                                    {
                                      "status": "error",
                                      "errorCode": "FHIR_CONNECTION_ERROR",
                                      "message": "No se pudo conectar con el servidor FHIR. Intente más tarde."
                                    }
                                """
                        )
                )
        )
})
public @interface VerifyIdentifierEndpointDoc { }