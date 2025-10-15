// API Client para manejar las llamadas al backend
import axios, { type AxiosResponse, type AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    try {
      console.log('🚀 API Request:', { url, method: 'POST', data });
      
      const response = await axios.post<T>(`${this.baseURL}${url}`, data, {
        headers: API_CONFIG.DEFAULT_HEADERS,
        timeout: API_CONFIG.TIMEOUT,
      });

      console.log('✅ API Response:', response.data);
      return response;
    } catch (error) {
      console.log('❌ API Error:', error);
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async get<T>(url: string): Promise<AxiosResponse<T>> {
    try {
      console.log('🚀 API Request:', { url, method: 'GET' });
      
      const response = await axios.get<T>(`${this.baseURL}${url}`, {
        headers: API_CONFIG.DEFAULT_HEADERS,
        timeout: API_CONFIG.TIMEOUT,
      });

      console.log('✅ API Response:', response.data);
      return response;
    } catch (error) {
      console.log('❌ API Error:', error);
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async put<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    try {
      console.log('🚀 API Request:', { url, method: 'PUT', data });
      
      const response = await axios.put<T>(`${this.baseURL}${url}`, data, {
        headers: API_CONFIG.DEFAULT_HEADERS,
        timeout: API_CONFIG.TIMEOUT,
      });

      console.log('✅ API Response:', response.data);
      return response;
    } catch (error) {
      console.log('❌ API Error:', error);
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    try {
      console.log('🚀 API Request:', { url, method: 'DELETE' });
      
      const response = await axios.delete<T>(`${this.baseURL}${url}`, {
        headers: API_CONFIG.DEFAULT_HEADERS,
        timeout: API_CONFIG.TIMEOUT,
      });

      console.log('✅ API Response:', response.data);
      return response;
    } catch (error) {
      console.log('❌ API Error:', error);
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  private handleError(error: AxiosError): void {
    if (error.response?.status === 404) {
      throw new Error('Recurso no encontrado');
    } else if (error.response?.status === 401) {
      throw new Error('No autorizado');
    } else if (error.response?.status === 500) {
      throw new Error('Error interno del servidor');
    } else {
      throw new Error('Error de conexión con el servidor');
    }
  }
}

export const apiClient = new ApiClient();