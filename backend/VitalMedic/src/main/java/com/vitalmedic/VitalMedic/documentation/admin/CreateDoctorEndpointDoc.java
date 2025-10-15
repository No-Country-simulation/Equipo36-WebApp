package com.vitalmedic.VitalMedic.documentation.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.*;

/**
 * Documentación Swagger para el endpoint de creación de doctores por parte de un administrador.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Registrar un nuevo doctor en el sistema",
        description = """
        Este endpoint permite a un **administrador** registrar un nuevo doctor dentro del sistema.  
        
        El doctor creado se vincula automáticamente con un usuario en Keycloak y se le asigna el rol **DOCTOR**.  
        Los datos básicos incluyen nombre, apellido, especialidad, correo electrónico y número de licencia profesional.  
        
        El endpoint requiere autenticación con permisos administrativos.
        """
        //security = @SecurityRequirement(name = "bearerAuth")
)
@ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Doctor creado exitosamente",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Respuesta exitosa",
                                value = """
                                    {
                                      "status": "success",
                                      "message": "Doctor creado con exito"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Datos inválidos en la solicitud (validación fallida)",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Solicitud inválida",
                                value = """
                                    {
                                      "status": "error",
                                      "message": "El email debe tener formato válido"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "401",
                description = "El token de autenticación no es válido o ha expirado",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "No autorizado",
                                value = """
                                    {
                                      "status": "error",
                                      "message": "No autorizado"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "409",
                description = "Conflicto — ya existe un usuario con el mismo correo electrónico",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Doctor duplicado",
                                value = """
                                    {
                                      "status": "error",
                                      "message": "Ya existe un usuario registrado con este correo electrónico"
                                    }
                                """
                        )
                )
        )
})
public @interface CreateDoctorEndpointDoc { }
