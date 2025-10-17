package com.vitalmedic.VitalMedic.documentation.doctor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Operation(
        summary = "Obtener un doctor por ID",
        description = """
        Este endpoint permite obtener la información detallada de un doctor mediante su identificador **UUID**.  
        Ejemplo de uso: `/api/doctors/{id}`.
        """
)
@ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "Doctor encontrado",
                content = @Content(
                        mediaType = "application/json",
                        examples = @ExampleObject(
                                name = "Respuesta exitosa",
                                value = """
                                    {
                                      "id": "8f5c8c67-0b0f-4b5a-8de3-6b54f8cd9cc4",
                                      "firstName": "Carlos",
                                      "lastName": "Ramírez",
                                      "specialty": "Cardiología",
                                      "licenseNumber": "CMP-9856",
                                      "experience": "10 años",
                                      "phone": "+51 987654321",
                                      "email": "carlos.ramirez@hospital.com"
                                    }
                                """
                        )
                )
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Doctor no encontrado"
        )
})
public @interface GetDoctorByIdEndpointDoc {
}
