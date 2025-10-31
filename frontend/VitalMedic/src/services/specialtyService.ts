import { apiClient } from "./apiClient";
import { API_CONFIG } from "../config/api.config";

export interface SpecialtyItem {
  id: number;
  name: string;
  averageDurationMinutes: number;
}

export interface CreateSpecialtyRequest {
  name: string;
  averageDurationMinutes: number;
}

export interface UpdateSpecialtyRequest {
  name: string;
  averageDurationMinutes: number;
}

export class SpecialtyService {
  static async getAll(): Promise<SpecialtyItem[]> {
    try {
      const response = await apiClient.get<any>("/api/specialty");
      const data = response.data?.data ?? response.data ?? [];
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn("No se pudieron obtener especialidades:", e);
      return [];
    }
  }

  // ✅ Obtener especialidad por ID (GET /api/specialty/{id})
  static async getById(id: number): Promise<SpecialtyItem> {
    try {
      console.log('📤 Obteniendo especialidad por ID:', id);
      
      const response = await apiClient.get<SpecialtyItem>(
        API_CONFIG.ENDPOINTS.SPECIALTY.GET_BY_ID.replace('{id}', id.toString())
      );
      
      console.log('📥 Especialidad obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener especialidad:', error);
      throw error;
    }
  }

  // ✅ Crear especialidad (POST /api/specialty)
  static async create(specialtyData: CreateSpecialtyRequest): Promise<SpecialtyItem> {
    try {
      console.log('📤 Creando especialidad:', specialtyData);
      
      const response = await apiClient.post<SpecialtyItem>(
        API_CONFIG.ENDPOINTS.SPECIALTY.CREATE,
        specialtyData
      );
      
      console.log('📥 Especialidad creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear especialidad:', error);
      throw error;
    }
  }

  // ✅ Actualizar especialidad (PUT /api/specialty/{id})
  static async update(id: number, specialtyData: UpdateSpecialtyRequest): Promise<SpecialtyItem> {
    try {
      console.log('📤 Actualizando especialidad:', id, specialtyData);
      
      const response = await apiClient.put<SpecialtyItem>(
        API_CONFIG.ENDPOINTS.SPECIALTY.UPDATE.replace('{id}', id.toString()),
        specialtyData
      );
      
      console.log('📥 Especialidad actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      throw error;
    }
  }
}


