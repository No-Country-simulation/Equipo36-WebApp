// API Client para manejar las llamadas al backend
import axios, { type AxiosResponse, type AxiosError } from "axios";
import { API_CONFIG } from "../config/api.config";
import keycloakClient from "../utils/keycloak";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
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
    try {
      const response = await axios.post<T>(`${this.baseURL}${url}`, data, {
        headers: this.getAuthHeaders(),
        timeout: API_CONFIG.TIMEOUT,
      });

      return response;
    } catch (error: any) {
      // Para los endpoints de onboarding, no usar handleError - dejamos que el servicio lo maneje
      if (
        url.includes("/patient/onbording/identifier") ||
        url.includes("/patient/onboarding/profile")
      ) {
        throw error;
      }

      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async get<T>(url: string): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.get<T>(`${this.baseURL}${url}`, {
        headers: this.getAuthHeaders(),
        timeout: API_CONFIG.TIMEOUT,
      });

      return response;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async put<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.put<T>(`${this.baseURL}${url}`, data, {
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
    try {
      const response = await axios.delete<T>(`${this.baseURL}${url}`, {
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
    if (error.response?.status === 404) {
      throw new Error("Recurso no encontrado");
    } else if (error.response?.status === 401) {
      throw new Error("No autorizado");
    } else if (error.response?.status === 500) {
      throw new Error("Error interno del servidor");
    } else {
      throw new Error("Error de conexión con el servidor");
    }
  }
}

export const apiClient = new ApiClient();
