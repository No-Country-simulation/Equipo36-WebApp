package com.vitalmedic.VitalMedic.domain.validators;

import com.vitalmedic.VitalMedic.domain.validators.impl.ImageFileValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ImageFileValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ImageFile {
    String message() default "El archivo debe ser una imagen válida (jpg, jpeg, png, webp)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

