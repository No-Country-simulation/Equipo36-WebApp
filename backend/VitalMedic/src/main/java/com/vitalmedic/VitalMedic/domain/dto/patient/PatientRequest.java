package com.vitalmedic.VitalMedic.domain.dto.patient;

import com.vitalmedic.VitalMedic.domain.enums.Gender;
import com.vitalmedic.VitalMedic.domain.validators.ImageFile;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

public record PatientRequest(
        String firstName,
        String lastName,
        String birthDate,
        Gender gender,
        String phone,
        String address,

        @Schema(description = "Archivo de imagen (jpg, jpeg, png, webp)")
        @ImageFile
        MultipartFile photo,

        @Schema(description = "Indica si se debe eliminar la foto actual", example = "false")
        Boolean deletePhoto
) {

}
