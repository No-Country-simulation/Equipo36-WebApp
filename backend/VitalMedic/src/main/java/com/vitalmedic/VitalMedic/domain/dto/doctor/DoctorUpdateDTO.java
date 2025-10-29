package com.vitalmedic.VitalMedic.domain.dto.doctor;


import com.vitalmedic.VitalMedic.domain.validators.ImageFile;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public record DoctorUpdateDTO(
        @NotBlank String firstName,
        @NotBlank String lastName,
        Long specialty,
        String licenseNumber,
        String experience,
        String phone,

        @Schema(description = "Archivo de imagen (jpg, jpeg, png, webp)")
        @ImageFile
        MultipartFile photo,

        @Schema(description = "Indica si se debe eliminar la foto actual", example = "false")
        Boolean deletePhoto

) {}
