// Appointment Service para manejar las operaciones relacionadas con citas médicas
import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api.config';

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string; // formato YYYY-MM-DD
  startTime: string;
  type: 'PRESENTIAL' | 'VIRTUAL';
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  patientId: string; // ID del paciente que solicita la cita
  date: string; // formato YYYY-MM-DD
  startTime: string; // formato HH:mm (sin segundos)
  type: 'PRESENTIAL' | 'VIRTUAL';
}

export class AppointmentService {

  // ✅ Crear cita médica (POST /api/appointments)
  static async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    try {
      console.log('📤 Creando cita médica:', appointmentData);

      const response = await apiClient.post<Appointment>(
        API_CONFIG.ENDPOINTS.APPOINTMENTS.CREATE,
        appointmentData
      );

      console.log('📥 Cita creada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear cita:', error);
      throw error;
    }
  }

  // ✅ Obtener citas de un paciente por fecha (GET /api/appointments/patient/{patientId}?date={date})
  static async getPatientAppointmentsByDate(patientId: string, date?: string): Promise<Appointment[]> {
    try {
      console.log('📤 Obteniendo citas del paciente:', patientId, date);

      let url = API_CONFIG.ENDPOINTS.APPOINTMENTS.GET_PATIENT_BY_DATE.replace('{patientId}', patientId);
      if (date) {
        url += `?date=${date}`;
      }

      const response = await apiClient.get<Appointment[]>(url);

      console.log('📥 Citas del paciente obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener citas del paciente:', error);
      throw error;
    }
  }

  // ✅ Obtener citas de un doctor por fecha (GET /api/appointments/doctor/{doctorId}?date={date})
  static async getDoctorAppointmentsByDate(doctorId: string, date?: string): Promise<Appointment[]> {
    try {
      console.log('📤 Obteniendo citas del doctor:', doctorId, date);

      let url = API_CONFIG.ENDPOINTS.APPOINTMENTS.GET_DOCTOR_BY_DATE.replace('{doctorId}', doctorId);
      if (date) {
        url += `?date=${date}`;
      }

      const response = await apiClient.get<Appointment[]>(url);

      console.log('📥 Citas del doctor obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener citas del doctor:', error);
      throw error;
    }
  }
}