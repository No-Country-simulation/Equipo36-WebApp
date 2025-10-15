package com.vitalmedic.VitalMedic.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class InvalidOnboardingStepException extends RuntimeException {
    public InvalidOnboardingStepException(String message) {
        super(message);
    }
}
