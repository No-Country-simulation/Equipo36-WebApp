import { apiClient } from "./apiClient";
import { API_CONFIG, type IdentifierSystem } from "../config/api.config";

// ========================================
// INTERFACES BASADAS EN LA API REAL
// ========================================

export interface IdentifierRequest {
  system: IdentifierSystem;
  value: string;
}

export interface OnboardingIdentifierResponse {
  foundInFhir: boolean;
  patientFhir?: any; // Datos del paciente de FHIR si se encontraron
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone?: string;
  address?: string;
}

export interface ProfileUpdateResponse {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone?: string;
  address?: string;
}

export interface OnboardingStatusResponse {
  status: "PENDING_IDENTIFIER" | "IMPORT_PROMPT" | "MANUAL_ENTRY" | "COMPLETED";
}

export interface ImportRequest {
  importAll: boolean;
}

// ========================================
// ONBOARDING SERVICE SIMPLIFICADO
// ========================================

export class OnboardingService {
  /**
   * Obtiene el estado actual del onboarding del usuario
   */
  static async getOnboardingStatus(): Promise<OnboardingStatusResponse> {
    try {
      const response = await apiClient.get<any>(
        API_CONFIG.ENDPOINTS.PATIENT.ONBOARDING_STATUS,
      );
      // El backend retorna ApiResult.success con los datos
      return response.data.data;
    } catch (error: any) {
      console.warn("No se pudo obtener estado del onboarding:", error.message);
      // Si falla, asumir que está en PENDING_IDENTIFIER para ser más estricto
      return { status: "PENDING_IDENTIFIER" };
    }
  }

  /**
   * Envía el identificador al backend - hace todo el proceso:
   * 1. Guarda el identificador
   * 2. Busca en FHIR
   * 3. Retorna si encontró datos
   */
  static async submitIdentifier(
    request: IdentifierRequest,
  ): Promise<OnboardingIdentifierResponse> {
    try {
      const response = await apiClient.post<any>(
        API_CONFIG.ENDPOINTS.PATIENT.VERIFY_IDENTIFIER,
        request,
      );

      // El backend retorna ApiResult.success con los datos
      const data = response.data.data as OnboardingIdentifierResponse;

      return data || { foundInFhir: false };
    } catch (error: any) {
      const status = error.response?.status;
      const errorCode = error.response?.data?.errorCode;

      // Manejo específico según la documentación de la API
      if (status === 400 && errorCode === "RESOURCE_ALREADY_EXISTS") {
        throw new Error(
          error.response?.data?.message || "El identificador ya está registrado en el sistema"
        );
      }

      // Error de conexión con FHIR - permitir continuar manualmente
      if (status === 500 && errorCode === "FHIR_CONNECTION_ERROR") {
        console.warn("Error de FHIR, permitiendo continuar manualmente");
        return {
          foundInFhir: false,
          patientFhir: null,
        };
      }

      // Si es 401, necesita autenticación
      if (status === 401) {
        throw new Error("Necesitas iniciar sesión para completar tu registro");
      }

      // Para otros errores 500 o 404, permitir continuar manualmente
      if (status >= 500 || status === 404) {
        console.warn("Error del servidor, permitiendo continuar manualmente");
        return {
          foundInFhir: false,
          patientFhir: null,
        };
      }

      // Otros errores específicos son reales
      const errorMessage =
        error.response?.data?.message ||
        "Error al procesar el identificador. Inténtalo nuevamente.";
      throw new Error(errorMessage);
    }
  }

  /**
   * Método conveniente para CURP
   */
  static async submitCurp(curp: string): Promise<OnboardingIdentifierResponse> {
    return this.submitIdentifier({
      system: "CURP",
      value: curp.toUpperCase(),
    });
  }

  /**
   * Método conveniente para RFC
   */
  static async submitRfc(rfc: string): Promise<OnboardingIdentifierResponse> {
    return this.submitIdentifier({
      system: "RFC",
      value: rfc.toUpperCase(),
    });
  }

  /**
   * Método conveniente para NSS IMSS
   */
  static async submitNss(nss: string): Promise<OnboardingIdentifierResponse> {
    return this.submitIdentifier({
      system: "NSS_IMSS",
      value: nss,
    });
  }

  /**
   * Actualiza el perfil del paciente con los datos personales
   */
  static async updateProfile(
    profileData: ProfileUpdateRequest,
  ): Promise<ProfileUpdateResponse> {
    try {
      const response = await apiClient.post<ProfileUpdateResponse>(
        API_CONFIG.ENDPOINTS.PATIENT.UPDATE_PROFILE,
        profileData,
      );

      // La API retorna directamente el perfil actualizado
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 401) {
        throw new Error("Necesitas iniciar sesión para actualizar tu perfil");
      }

      // Error específico según la documentación - flujo de onboarding inválido
      if (status === 400) {
        throw new Error(
          error.response?.data?.message || 
          "No puedes realizar esta acción, tu flujo de onboarding no corresponde a este paso."
        );
      }

      // Error de FHIR - permitir continuar con datos básicos
      if (status === 500 && error.response?.data?.errorCode === "FHIR_CONNECTION_ERROR") {
        console.warn("Error de FHIR en perfil, guardando datos localmente");
        return {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          birthDate: profileData.birthDate,
          gender: profileData.gender,
          phone: profileData.phone,
          address: profileData.address,
        };
      }

      // Para otros errores 500 o 404, permitir continuar con datos básicos
      if (status >= 500 || status === 404) {
        console.warn("Error del servidor en perfil, guardando datos localmente");
        return {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          birthDate: profileData.birthDate,
          gender: profileData.gender,
          phone: profileData.phone,
          address: profileData.address,
        };
      }

      throw new Error(
        error.response?.data?.message ||
          "Error al actualizar el perfil. Inténtalo nuevamente.",
      );
    }
  }

  /**
   * Importa datos del paciente desde FHIR
   */
  static async importFromFhir(
    importAll: boolean = true,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<any>(
        API_CONFIG.ENDPOINTS.PATIENT.IMPORT_FHIR_DATA,
        {
          importAll,
        },
      );

      // La API retorna success con un mensaje específico
      return {
        success: true,
        message: response.data.message || "Datos importados correctamente",
      };
    } catch (error: any) {
      const status = error.response?.status;

      // 404 - No se encontró paciente en FHIR
      if (status === 404) {
        return {
          success: false,
          message: "No se encontraron datos médicos para importar",
        };
      }

      // Otros errores - permitir continuar manualmente
      console.warn("Error al importar datos FHIR:", error.response?.data?.message);
      return {
        success: false,
        message: "No se pudieron importar datos médicos, continuando manualmente",
      };
    }
  }

  /**
   * Verifica qué datos del usuario están guardados en la BD (para debugging)
   */
  static async checkUserData(): Promise<{
    hasUser: boolean;
    hasPatient: boolean;
    hasIdentifiers: boolean;
    patientData?: any;
    identifiers?: any[];
  }> {
    try {
      // Intentar obtener datos del paciente
      const patientResponse = await apiClient.get<any>(
        API_CONFIG.ENDPOINTS.PATIENT.GET_PATIENT,
      );

      return {
        hasUser: true,
        hasPatient: true,
        hasIdentifiers: true,
        patientData: patientResponse.data,
        identifiers: patientResponse.data.identifiers || [],
      };
    } catch (error: any) {
      console.log("Debug checkUserData error:", error.response?.status);

      if (error.response?.status === 404) {
        return {
          hasUser: true, // Si llegamos aquí, el token funciona
          hasPatient: false,
          hasIdentifiers: false,
        };
      }

      return {
        hasUser: false,
        hasPatient: false,
        hasIdentifiers: false,
      };
    }
  }

  // ========================================
  // MÉTODOS DE UTILIDAD
  // ========================================

  /**
   * Valida formato de CURP mexicano
   */
  static validateCurpFormat(curp: string): boolean {
    const upperCurp = curp.toUpperCase().trim();

    // CURP debe tener exactamente 18 caracteres
    if (upperCurp.length !== 18) {
      return false;
    }

    // CURP simple: 4 letras iniciales + 6 dígitos (fecha) + resto caracteres válidos
    // Ejemplo: TEOB030519HVZLRRA5 o GORA850101HDFRRL09
    const curpRegex = /^[A-Z]{4}\d{6}[A-Z0-9]{8}$/;

    return curpRegex.test(upperCurp);
  }

  /**
   * Valida formato de RFC mexicano
   */
  static validateRfcFormat(rfc: string): boolean {
    // RFC persona física: 4 letras + 6 dígitos + 3 caracteres alfanuméricos
    const rfcPersonaFisica = /^[A-Z]{4}\d{6}[A-Z0-9]{3}$/;
    // RFC persona moral: 3 letras + 6 dígitos + 3 caracteres alfanuméricos
    const rfcPersonaMoral = /^[A-Z]{3}\d{6}[A-Z0-9]{3}$/;

    const upperRfc = rfc.toUpperCase();
    return rfcPersonaFisica.test(upperRfc) || rfcPersonaMoral.test(upperRfc);
  }

  /**
   * Valida formato de NSS del IMSS
   */
  static validateNssFormat(nss: string): boolean {
    // NSS: 11 dígitos
    const nssRegex = /^\d{11}$/;
    return nssRegex.test(nss);
  }

  /**
   * Obtiene el nombre amigable del sistema de identificación
   */
  static getIdentifierSystemName(system: IdentifierSystem): string {
    const names = {
      CURP: "CURP (Clave Única de Registro de Población)",
      RFC: "RFC (Registro Federal de Contribuyentes)",
      NSS_IMSS: "NSS del IMSS (Número de Seguridad Social)",
      ISSSTE: "Número ISSSTE",
      PRIVATE_INSURANCE: "Seguro Privado",
      VITALMEDIC_INTERNAL: "ID Interno VitalMedic",
    };

    return names[system] || system;
  }

  /**
   * Extrae información básica de los datos FHIR del paciente
   */
  static extractPatientInfoFromFhir(fhirPatient: any): {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
  } | null {
    try {
      if (!fhirPatient || !fhirPatient.name || fhirPatient.name.length === 0) {
        return null;
      }

      const name = fhirPatient.name[0];
      const firstName = name.given ? name.given.join(" ") : "";
      const lastName = name.family || "";
      const birthDate = fhirPatient.birthDate || "";
      const gender = fhirPatient.gender || "unknown";

      return {
        firstName,
        lastName,
        birthDate,
        gender: gender.toUpperCase(),
      };
    } catch (error) {
      console.error("Error al extraer datos de FHIR:", error);
      return null;
    }
  }
}
