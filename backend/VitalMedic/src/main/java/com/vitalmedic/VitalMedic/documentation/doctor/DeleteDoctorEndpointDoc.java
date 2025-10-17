package com.vitalmedic.VitalMedic.documentation.doctor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Eliminar un doctor",
        description = """
        Este endpoint elimina un doctor identificado por su **UUID**.  
        Esta operación no se puede deshacer.
        """
)
@ApiResponses({
        @ApiResponse(
                responseCode = "204",
                description = "Doctor eliminado exitosamente (sin contenido en la respuesta)"
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Doctor no encontrado"
        )
})
public @interface DeleteDoctorEndpointDoc { }
