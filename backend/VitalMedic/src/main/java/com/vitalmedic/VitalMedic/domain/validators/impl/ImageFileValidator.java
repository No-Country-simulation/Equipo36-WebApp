package com.vitalmedic.VitalMedic.domain.validators.impl;

import com.vitalmedic.VitalMedic.domain.validators.ImageFile;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class ImageFileValidator implements ConstraintValidator<ImageFile, MultipartFile> {

    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
    );

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) {
            return true;
        }
        return ALLOWED_TYPES.contains(file.getContentType());
    }
}
