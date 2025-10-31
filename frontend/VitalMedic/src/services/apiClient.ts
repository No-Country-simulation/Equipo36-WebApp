// API Client para manejar las llamadas al backend
import axios, { type AxiosResponse, type AxiosError } from "axios";
import { API_CONFIG } from "../config/api.config";
import keycloakClient from "../utils/keycloak";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Normaliza y construye la URL final; si ya es absoluta, la respeta
  private buildUrl(pathOrUrl: string): string {
    const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
    const finalUrl = isAbsolute
      ? pathOrUrl
      : `${this.baseURL.replace(/\/+$/,'')}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
    // Log de debugging
    // eslint-disable-next-line no-console
    console.debug("API →", finalUrl);
    return finalUrl;
  }

  // Método para obtener el token de Keycloak directamente del cliente
  private getAuthToken(): string | null {
    try {
      if (keycloakClient && keycloakClient.token) {
        // Asegurarse de que el token sea válido
        if (keycloakClient.isTokenExpired()) {
          keycloakClient.updateToken(30);
        }
        return keycloakClient.token;
      }
      return null;
    } catch (error) {
      console.warn("No se pudo obtener el token de autenticación:", error);
      return null;
    }
  }

  // Método para obtener headers con autenticación
  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    const finalUrl = this.buildUrl(url);
    try {
      const response = await axios.post<T>(finalUrl, data, {
        headers: this.getAuthHeaders(),
        timeout: API_CONFIG.TIMEOUT,
      });

      return response;
    } catch (error: any) {
      // Para los endpoints de onboarding, no usar handleError - dejamos que el servicio lo maneje
      if (
        // identifier tiene ruta con typo 'onbording' en backend
        url.includes("/api/patient/onbording/identifier")   || finalUrl.includes("/api/patient/onbording/identifier")   ||
        url.includes("/api/patient/onboarding/identifier")  || finalUrl.includes("/api/patient/onboarding/identifier")  ||
        url.includes("/api/patient/onboarding/profile")   || finalUrl.includes("/api/patient/onboarding/profile")   ||
        url.includes("/api/patient/onboarding/import")    || finalUrl.includes("/api/patient/onboarding/import")    ||
        url.includes("/api/patient/onboarding/status")    || finalUrl.includes("/api/patient/onboarding/status")
      ) {
        throw error;
      }

      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async get<T>(url: string): Promise<AxiosResponse<T>> {
    const finalUrl = this.buildUrl(url);
    try {
      const response = await axios.get<T>(finalUrl, {
        headers: this.getAuthHeaders(),
        timeout: API_CONFIG.TIMEOUT,
      });

      return response;
    } catch (error: any) {
      // Para los endpoints de onboarding, no usar handleError - dejamos que el servicio lo maneje
      if (
        url.includes("/api/patient/onboarding/identifier")   || finalUrl.includes("/api/patient/onboarding/identifier")   ||
        url.includes("/api/patient/onboarding/identifier")  || finalUrl.includes("/api/patient/onboarding/identifier")  ||
        url.includes("/api/patient/onboarding/profile")   || finalUrl.includes("/api/patient/onboarding/profile")   ||
        url.includes("/api/patient/onboarding/import")    || finalUrl.includes("/api/patient/onboarding/import")    ||
        url.includes("/api/patient/onboarding/status")    || finalUrl.includes("/api/patient/onboarding/status")
      ) {
        throw error;
      }

      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async put<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    const finalUrl = this.buildUrl(url);
    try {
      const response = await axios.put<T>(finalUrl, data, {
        headers: this.getAuthHeaders(),
        timeout: API_CONFIG.TIMEOUT,
      });

      return response;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    const finalUrl = this.buildUrl(url);
    try {
      const response = await axios.delete<T>(finalUrl, {
        headers: this.getAuthHeaders(),
        timeout: API_CONFIG.TIMEOUT,
      });

      return response;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  private handleError(error: AxiosError): void {
    console.error("Error de API:", error.response?.status, error.response?.data);
    
    const errorData = error.response?.data as any;
    
    if (error.response?.status === 404) {
      throw new Error("Recurso no encontrado");
    } else if (error.response?.status === 401) {
      throw new Error("No autorizado");
    } else if (error.response?.status === 409) {
      // Conflicto - cita duplicada o horario ocupado
      const message = errorData?.message || errorData?.details?.[0] || "Ya existe una cita en este horario";
      throw new Error(message);
    } else if (error.response?.status === 400) {
      // Bad Request - datos inválidos o doctor no disponible
      const message = errorData?.message || errorData?.details?.[0] || "Datos inválidos o horario fuera del horario laboral del doctor";
      throw new Error(message);
    } else if (error.response?.status === 500) {
      throw new Error("Error interno del servidor");
    } else {
      throw new Error("Error de conexión con el servidor");
    }
  }
}

export const apiClient = new ApiClient();
