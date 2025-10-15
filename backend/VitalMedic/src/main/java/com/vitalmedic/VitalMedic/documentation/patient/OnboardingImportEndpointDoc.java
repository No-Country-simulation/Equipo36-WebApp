package com.vitalmedic.VitalMedic.documentation.patient;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Importar datos del paciente desde FHIR",
        description = """
        Este endpoint permite importar información médica del paciente (condiciones, alergias, observaciones, etc.) 
        desde el servidor FHIR asociado a su identificador.  
        
        Si el paciente acepta importar todos sus datos (`importAll=true`), se sincronizan automáticamente 
        con la base de datos local y se completa el proceso de onboarding.
        """,
        security = @SecurityRequirement(name = "bearerAuth")
)
@ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Datos importados correctamente o decisión registrada",
                content = @Content(
                        mediaType = "application/json",
                        examples = {
                                @ExampleObject(
                                        name = "Importación exitosa",
                                        value = """
                                            {
                                              "status": "success",
                                              "message": "Datos importados con exito"
                                            }
                                        """
                                ),
                                @ExampleObject(
                                        name = "Decisión de no importar",
                                        value = """
                                            {
                                              "status": "success",
                                              "message": "Respetamos tu decisión, tus datos no se han importado"
                                            }
                                        """
                                )
                        }
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "No se encontró el paciente en el servidor FHIR",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Paciente no encontrado",
                                value = """
                                    {
                                      "status": "error",
                                      "message": "No se encontró el paciente en el servidor FHIR"
                                    }
                                """
                        )
                )
        )
})
public @interface OnboardingImportEndpointDoc { }
