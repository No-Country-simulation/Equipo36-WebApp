import { apiClient } from "./apiClient";
import { API_CONFIG } from "../config/api.config";

export interface PatientAppointmentItem {
  id: string;
  doctorId?: string;
  doctorName?: string;
  specialty?: string;
  date: string; // yyyy-MM-dd
  startTime?: string; // HH:mm
  type?: "PRESENTIAL" | "VIRTUAL" | string;
  status?: string;
}

export class HistoryService {
  /**
   * Obtiene citas de un paciente por fecha (yyyy-MM-dd)
   */
  static async getAppointmentsByDate(patientId: string, dateIso: string): Promise<PatientAppointmentItem[]> {
    try {
      const url = `${API_CONFIG.ENDPOINTS.APPOINTMENTS?.PATIENT_BY_DATE || "/api/appointments/patient/"}${patientId}?date=${encodeURIComponent(dateIso)}`;
      const response = await apiClient.get<any>(url);
      const data = response.data?.data ?? response.data ?? [];

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => ({
        id: String(item.id ?? item.appointmentId ?? cryptoRandom()),
        doctorId: item.doctorId ?? item.doctor?.id,
        doctorName: item.doctorName ?? item.doctor?.fullName ?? joinName(item.doctor?.firstName, item.doctor?.lastName),
        specialty: item.specialty ?? item.doctor?.specialty,
        date: item.date ?? dateIso,
        startTime: item.startTime ?? item.time ?? item.startHour,
        type: item.type ?? item.appointmentType,
        status: item.status ?? item.appointmentStatus,
      }));
    } catch (e) {
      console.warn("HistoryService.getAppointmentsByDate error:", e);
      return [];
    }
  }
}

function joinName(first?: string, last?: string): string | undefined {
  if (!first && !last) return undefined;
  return `${first || ""} ${last || ""}`.trim();
}

function cryptoRandom(): string {
  try {
    // Fallback simple, no crypto en todos los entornos
    return Math.random().toString(36).slice(2);
  } catch {
    return Date.now().toString(36);
  }
}


