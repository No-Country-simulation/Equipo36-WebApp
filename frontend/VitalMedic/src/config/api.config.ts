/**
 * Configuración central de la API de VitalMedic Backend
 * Backend desplegado en: https://vitalmedic-backend.onrender.com
 * Documentación Swagger: https://vitalmedic-backend.onrender.com/swagger-ui/index.html
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  API_VERSION: 'v1.0.0',
  TIMEOUT: 30000, // 30 segundos
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Endpoints principales
  ENDPOINTS: {
    // Paciente - Onboarding (Requieren autenticación)
    PATIENT: {
      VERIFY_IDENTIFIER: '/patient/onbording/identifier', // Backend tiene typo onbording (sin 'a')
      UPDATE_PROFILE: '/patient/onboarding/profile',
      IMPORT_FHIR_DATA: '/patient/onboarding/import',
      ONBOARDING_STATUS: '/patient/onboarding/status',
    },
    
    // Admin
    ADMIN: {
      CREATE_DOCTOR: '/admin/create-doctor', // ✅ Funciona sin auth
    },
    
    // Doctores (Públicos - sin autenticación requerida)
    DOCTORS: {
      GET_ALL: '/admin/doctors/get-all-doctors', // ✅ Funciona
      GET_BY_ID: '/admin/doctors/get-doctor', // ✅ Funciona
      UPDATE: '/admin/doctors/update-doctor', // ✅ Funciona
      DELETE: '/admin/doctors/delete-doctor', // ✅ Funciona
    },
    
    // Enums
    ENUMS: {
      IDENTIFIER_SYSTEMS: '/enums/identifier-systems',
    },
    
    // Keycloak Webhook (interno)
    KEYCLOAK: {
      WEBHOOK: '/keycloak/webhook',
    },
  },

  // Códigos de error personalizados del backend
  ERROR_CODES: {
    RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
    FHIR_CONNECTION_ERROR: 'FHIR_CONNECTION_ERROR',
    INVALID_PAYLOAD: 'INVALID_PAYLOAD',
    FORBIDDEN: 'FORBIDDEN',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  },
} as const;

// Sistemas de identificación disponibles
export const IDENTIFIER_SYSTEMS = {
  CURP: 'CURP',
  RFC: 'RFC',
  NSS_IMSS: 'NSS_IMSS',
  ISSSTE: 'ISSSTE',
  PRIVATE_INSURANCE: 'PRIVATE_INSURANCE',
  VITALMEDIC_INTERNAL: 'VITALMEDIC_INTERNAL',
} as const;

// Estados del onboarding
export const ONBOARDING_STATUS = {
  PENDING_IDENTIFIER: 'PENDING_IDENTIFIER',
  IMPORT_PROMPT: 'IMPORT_PROMPT',
  MANUAL_ENTRY: 'MANUAL_ENTRY',
  COMPLETED: 'COMPLETED',
} as const;

// Géneros disponibles
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export type IdentifierSystem = keyof typeof IDENTIFIER_SYSTEMS;
export type OnboardingStatus = keyof typeof ONBOARDING_STATUS;
export type Gender = keyof typeof GENDER;
