// Patient Service para manejar las operaciones relacionadas con pacientes
import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api.config';

export interface IdentifierRequest {
  system: 'CURP' | 'RFC' | 'NSS_IMSS' | 'ISSSTE' | 'PRIVATE_INSURANCE';
  value: string;
}

export interface IdentifierResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class PatientService {
  
  static async verifyIdentifier(request: IdentifierRequest): Promise<IdentifierResponse> {
    try {
      console.log('📤 Enviando verificación de identificador:', request);
      
      const response = await apiClient.post<IdentifierResponse>(
        API_CONFIG.ENDPOINTS.PATIENT.VERIFY_IDENTIFIER,
        request
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al verificar identificador:', error);
      throw error;
    }
  }

  static async verifyCurp(curp: string): Promise<{ exists: boolean }> {
    try {
      const request: IdentifierRequest = {
        system: 'CURP',
        value: curp
      };
      
      console.log('📤 Verificando CURP:', curp);
      
      const response = await apiClient.post<IdentifierResponse>(
        API_CONFIG.ENDPOINTS.PATIENT.VERIFY_IDENTIFIER,
        request
      );
      
      // Si la respuesta es exitosa, significa que el CURP ya existe
      return { exists: response.data.success };
    } catch (error: any) {
      console.error('Error al verificar CURP:', error);
      
      // Si es un error 404, significa que no existe (lo cual es bueno)
      if (error.response?.status === 404) {
        return { exists: false };
      }
      
      throw error;
    }
  }

  static async createPatient(patientData: any): Promise<any> {
    try {
      console.log('📤 Creando paciente:', patientData);
      
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.PATIENT.UPDATE_PROFILE,
        patientData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error;
    }
  }
}