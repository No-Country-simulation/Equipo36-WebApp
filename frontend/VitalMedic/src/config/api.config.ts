/**
 * Configuración central de la API de VitalMedic Backend
 * Backend desplegado en: https://vitalmedic-backend.onrender.com
 * Documentación Swagger: https://vitalmedic-backend.onrender.com/swagger-ui/index.html
 */

export const API_CONFIG = {
  BASE_URL: "https://vitalmedic-backend.onrender.com",
  API_VERSION: "v1.0.0",
  TIMEOUT: 30000, // 30 segundos

  // Headers por defecto
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Endpoints principales
  ENDPOINTS: {
    // Paciente - Onboarding (Requieren autenticación)
    PATIENT: {
      VERIFY_IDENTIFIER: "/api/patient/onboarding/identifier", 
      UPDATE_PROFILE: "/api/patient/onboarding/profile", 
      IMPORT_FHIR_DATA: "/api/patient/onboarding/import", 
      ONBOARDING_STATUS: "/api/patient/onboarding/status", 
      GET_PATIENT: "/api/patient",
      GET_PATIENT_BY_ID: "/api/patient",
    },

    // Citas y Consultas (mínimo necesario para historial)
    APPOINTMENTS: {
      CREATE: "/api/appointments", // POST para crear nueva cita
      GET_PATIENT_BY_DATE: "/api/appointments/patient/{patientId}", // GET con query param ?date=YYYY-MM-DD
      GET_DOCTOR_BY_DATE: "/api/appointments/doctor/{doctorId}", // GET con query param ?date=YYYY-MM-DD
      UPDATE_STATUS: "/api/appointments/{appointmentId}/status", // PUT para actualizar estado
    },

    // Especialidades
    SPECIALTY: {
      GET_ALL: "/api/specialties",
      GET_BY_ID: "/api/specialties/{id}",
      CREATE: "/api/specialties",
      UPDATE: "/api/specialties/{id}",
      DELETE: "/api/specialties/{id}",
    },

    // Admin
    ADMIN: {
      CREATE_DOCTOR: "/admin/create-doctor", // Funciona sin auth
    },

    // Doctores (Públicos - sin autenticación requerida)
    DOCTORS: {
      // Públicos
      GET_ALL_PUBLIC: "/api/doctors",
      GET_AVAILABLE_DATES: "/api/doctors/{doctorId}/available-dates",
      GET_AVAILABILITY_BY_DATE: "/api/doctors/{doctorId}/availability",
      GET_BY_SPECIALTY: "/api/doctors/specialty/{id}",

      // Admin
      GET_ALL: "/admin/doctors/get-all-doctors",
      GET_BY_ID: "/admin/doctors/get-doctor",
      UPDATE: "/admin/doctors/update-doctor",
      DELETE: "/admin/doctors/delete-doctor",
    },

    // Enums
    ENUMS: {
      IDENTIFIER_SYSTEMS: "/enums/identifier-systems",
    },

    // Keycloak Webhook (interno)
    KEYCLOAK: {
      WEBHOOK: "/keycloak/webhook",
    },
  },

  // Códigos de error personalizados del backend
  ERROR_CODES: {
    RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
    FHIR_CONNECTION_ERROR: "FHIR_CONNECTION_ERROR",
    INVALID_PAYLOAD: "INVALID_PAYLOAD",
    FORBIDDEN: "FORBIDDEN",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  },
} as const;

// Sistemas de identificación disponibles
export const IDENTIFIER_SYSTEMS = {
  CURP: "CURP",
  RFC: "RFC",
  NSS_IMSS: "NSS_IMSS",
  ISSSTE: "ISSSTE",
  PRIVATE_INSURANCE: "PRIVATE_INSURANCE",
  VITALMEDIC_INTERNAL: "VITALMEDIC_INTERNAL",
} as const;

// Estados del onboarding
export const ONBOARDING_STATUS = {
  PENDING_IDENTIFIER: "PENDING_IDENTIFIER",
  IMPORT_PROMPT: "IMPORT_PROMPT",
  MANUAL_ENTRY: "MANUAL_ENTRY",
  COMPLETED: "COMPLETED",
} as const;

// Géneros disponibles
export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type IdentifierSystem = keyof typeof IDENTIFIER_SYSTEMS;
export type OnboardingStatus = keyof typeof ONBOARDING_STATUS;
export type Gender = keyof typeof GENDER;
