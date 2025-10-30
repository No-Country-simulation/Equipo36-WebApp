package com.vitalmedic.VitalMedic.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FhirConnectionException.class)
    public ResponseEntity<ErrorResponse> handleFhirConnectionException(FhirConnectionException ex, HttpServletRequest request) {
        log.error("❌ Error de conexión con FHIR en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                "FHIR_CONNECTION_ERROR",
                "Error al conectar con el servidor FHIR",
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
    }

    @ExceptionHandler(InvalidOnboardingStepException.class)
    public ResponseEntity<ErrorResponse> handleInvalidOnboardingStepException(InvalidOnboardingStepException ex, HttpServletRequest request) {
        log.warn("⚠️ Paso de onboarding inválido en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "INVALID_ONBOARDING_STEP",
                "Acción no permitida en esta etapa del onboarding",
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleResourceAlreadyExistsException(ResourceAlreadyExistsException ex, HttpServletRequest request) {
        log.warn("⚠️ Recurso duplicado en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "RESOURCE_ALREADY_EXISTS",
                "El recurso ya existe",
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
        log.warn("⚠️ Recurso no encontrado en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "RESOURCE_NOT_FOUND",
                "El recurso solicitado no fue encontrado",
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(DoctorNotAvailableException.class)
    public ResponseEntity<ErrorResponse> handleDoctorNotAvailableException(DoctorNotAvailableException ex, HttpServletRequest request) {
        log.warn("🚫 Intento de crear cita fuera del horario laboral: {}", ex.getMessage());
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "DOCTOR_NOT_AVAILABLE",
                "El horario seleccionado no pertenece al horario laboral del doctor",
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(AppointmentConflictException.class)
    public ResponseEntity<ErrorResponse> handleAppointmentConflictException(AppointmentConflictException ex, HttpServletRequest request) {
        log.warn("⚠️ Conflicto de horario en creación de cita: {}", ex.getMessage());
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "APPOINTMENT_CONFLICT",
                "El horario seleccionado ya está ocupado",
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(ScheduleConflictException.class)
    public ResponseEntity<ErrorResponse> handleScheduleConflictException(
            ScheduleConflictException ex, HttpServletRequest request) {
        log.warn("⚠️ Conflicto de horario detectado en {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "SCHEDULE_CONFLICT",
                "Se detectó un conflicto en los bloques horarios enviados.",
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // -----------------------------------------------------------------------
    // 🔹 Manejadores existentes
    // -----------------------------------------------------------------------

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {

        String paramName = ex.getName(); // nombre del parámetro
        String paramValue = ex.getValue() != null ? ex.getValue().toString() : "null";
        String expectedType = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "desconocido";

        log.warn("⚠️ Tipo de argumento inválido para '{}': valor='{}', tipo esperado={}",
                paramName, paramValue, expectedType);

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "INVALID_PARAMETER_TYPE",
                "Tipo de parámetro inválido",
                List.of("El parámetro '" + paramName + "' recibió el valor '" + paramValue +
                        "' pero se esperaba tipo " + expectedType + "."),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("💥 Error no controlado en {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_SERVER_ERROR",
                "Ocurrió un error interno en el servidor",
                Collections.singletonList("Se produjo un error inesperado. Por favor, intenta más tarde."),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> detalles = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.toList());

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                "Falló la validación de los campos",
                detalles,
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "BAD_REQUEST",
                "Solicitud inválida",
                Collections.singletonList(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex, HttpServletRequest request) {

        String rootMessage = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        String userFriendlyMessage = "Valor duplicado detectado";
        List<String> details = List.of(rootMessage);

        if (rootMessage != null && rootMessage.contains("Detail: Ya existe la llave")) {
            int startField = rootMessage.indexOf('(') + 1;
            int endField = rootMessage.indexOf(')', startField);
            int startValue = rootMessage.indexOf("=(", endField) + 2;
            int endValue = rootMessage.indexOf(").", startValue);

            if (startField > 0 && endField > startField && startValue > 1 && endValue > startValue) {
                String field = rootMessage.substring(startField, endField);
                String value = rootMessage.substring(startValue, endValue);
                userFriendlyMessage = "El valor para el campo '" + field + "' ya está en uso";
                details = List.of(field + ": " + value + " ya registrado.");
            }
        }

        ErrorResponse errorResponse = new ErrorResponse(
                HttpServletResponse.SC_CONFLICT,
                "CONFLICT",
                userFriendlyMessage,
                details,
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpServletResponse.SC_CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "BAD_CREDENTIALS",
                "Credenciales inválidas",
                List.of("El correo o la contraseña son incorrectos."),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpServletResponse.SC_FORBIDDEN,
                "FORBIDDEN",
                "Acceso denegado: no tienes permisos para acceder a este recurso",
                List.of("El usuario no tiene autorización suficiente para realizar esta acción."),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(org.springframework.web.bind.MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(org.springframework.web.bind.MissingServletRequestParameterException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "MISSING_PARAMETER",
                "Falta un parámetro obligatorio",
                Collections.singletonList("Parámetro faltante: " + ex.getParameterName()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(org.springframework.http.converter.HttpMessageNotReadableException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "MESSAGE_NOT_READABLE",
                "El cuerpo de la solicitud es inválido o está mal formado",
                List.of("Revisa la estructura de los datos enviados en la petición."),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
