// Doctor Service para manejar las operaciones relacionadas con doctores
import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api.config';

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string;
  experience: string;
  phone: string;
  user: {
    id: string;
    email: string;
    username: string;
    keycloakId: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  experience: string;
  phone: string;
  password: string;
}

export class DoctorService {
  
  // ✅ Obtener todos los doctores (Funciona sin autenticación)
  static async getAllDoctors(): Promise<Doctor[]> {
    try {
      console.log('📤 Obteniendo todos los doctores');
      
      const response = await apiClient.get<Doctor[]>(
        API_CONFIG.ENDPOINTS.DOCTORS.GET_ALL
      );
      
      console.log('📥 Doctores obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener doctores:', error);
      throw error;
    }
  }

  // ✅ Obtener doctor por ID (Funciona sin autenticación)
  static async getDoctorById(id: string): Promise<Doctor> {
    try {
      console.log('📤 Obteniendo doctor por ID:', id);
      
      const response = await apiClient.get<Doctor>(
        `${API_CONFIG.ENDPOINTS.DOCTORS.GET_BY_ID}/${id}`
      );
      
      console.log('📥 Doctor obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener doctor:', error);
      throw error;
    }
  }

  // ✅ Crear doctor (Funciona sin autenticación)
  static async createDoctor(doctorData: CreateDoctorRequest): Promise<any> {
    try {
      console.log('📤 Creando doctor:', doctorData);
      
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.ADMIN.CREATE_DOCTOR,
        doctorData
      );
      
      console.log('📥 Doctor creado exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error al crear doctor:', error);
      throw error;
    }
  }

  // ✅ Actualizar doctor (Funciona sin autenticación)
  static async updateDoctor(id: string, doctorData: Partial<Doctor>): Promise<Doctor> {
    try {
      console.log('📤 Actualizando doctor:', id, doctorData);
      
      const response = await apiClient.put<Doctor>(
        `${API_CONFIG.ENDPOINTS.DOCTORS.UPDATE}/${id}`,
        doctorData
      );
      
      console.log('📥 Doctor actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar doctor:', error);
      throw error;
    }
  }

  // ✅ Eliminar doctor (Funciona sin autenticación)
  static async deleteDoctor(id: string): Promise<void> {
    try {
      console.log('📤 Eliminando doctor:', id);
      
      await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.DOCTORS.DELETE}/${id}`
      );
      
      console.log('📥 Doctor eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar doctor:', error);
      throw error;
    }
  }
}