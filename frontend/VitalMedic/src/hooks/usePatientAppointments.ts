import { useState, useEffect } from 'react';
import { AppointmentService, type Appointment } from '../services/appointmentService';

// Interfaz extendida para la UI con información adicional
export interface AppointmentUI extends Appointment {
  time: string; // Alias para startTime
  doctorName: string; // Se obtendrá del doctorId o será un placeholder
  specialty: string; // Se obtendrá del doctorId o será un placeholder
  location?: string; // Basado en el tipo (PRESENTIAL/VIRTUAL)
}

export const usePatientAppointments = (patientId?: string) => {
  const [appointments, setAppointments] = useState<AppointmentUI[]>([]);
  const [nextAppointment, setNextAppointment] = useState<AppointmentUI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para mapear Appointment a AppointmentUI
  const mapToAppointmentUI = (appointment: Appointment): AppointmentUI => {
    return {
      ...appointment,
      time: appointment.startTime,
      doctorName: `Doctor ${appointment.doctorId}`, // Placeholder - idealmente se obtendría de un servicio de doctores
      specialty: appointment.type === 'PRESENTIAL' ? 'Consulta Presencial' : 'Consulta Virtual',
      location: appointment.type === 'VIRTUAL' ? 'Consulta Virtual' : 'Consultorio Médico'
    };
  };

  const fetchAppointments = async (date?: string) => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const currentDate = date || new Date().toISOString().split('T')[0];
      const response = await AppointmentService.getPatientAppointmentsByDate(patientId, currentDate);
      
      if (response && Array.isArray(response)) {
        const mappedAppointments = response.map(mapToAppointmentUI);
        setAppointments(mappedAppointments);
        
        // Encontrar la próxima cita
        const now = new Date();
        const upcomingAppointments = mappedAppointments
          .filter(apt => new Date(`${apt.date}T${apt.startTime}`) > now && apt.status === 'SCHEDULED')
          .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());
        
        setNextAppointment(upcomingAppointments.length > 0 ? upcomingAppointments[0] : null);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Error al cargar las citas');
      setAppointments([]);
      setNextAppointment(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingAppointments = async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      // Obtener citas de los próximos 30 días
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30);

      const allAppointments: AppointmentUI[] = [];
      
      // Hacer múltiples llamadas para obtener citas de diferentes fechas
      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        try {
          const response = await AppointmentService.getPatientAppointmentsByDate(patientId, dateStr);
          if (response && Array.isArray(response)) {
            const mappedResponse = response.map(mapToAppointmentUI);
            allAppointments.push(...mappedResponse);
          }
        } catch (err) {
          // Continuar con la siguiente fecha si hay error
          console.warn(`Error fetching appointments for ${dateStr}:`, err);
        }
      }

      setAppointments(allAppointments);
      
      // Encontrar la próxima cita
      const now = new Date();
      const upcomingAppointments = allAppointments
        .filter(apt => new Date(`${apt.date}T${apt.startTime}`) > now && apt.status === 'SCHEDULED')
        .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());
      
      setNextAppointment(upcomingAppointments.length > 0 ? upcomingAppointments[0] : null);
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
      setError('Error al cargar las citas próximas');
      setAppointments([]);
      setNextAppointment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchUpcomingAppointments();
    }
  }, [patientId]);

  return {
    appointments,
    nextAppointment,
    loading,
    error,
    refetch: fetchUpcomingAppointments,
    fetchAppointmentsByDate: fetchAppointments
  };
};