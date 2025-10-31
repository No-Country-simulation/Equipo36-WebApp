import { useEffect, useState } from "react";
import { DoctorService, type TimeSlot } from "../services/doctorService";

interface AvailabilityData {
  date: string; // YYYY-MM-DD
  availableSlots: TimeSlot[];
  occupiedSlots: TimeSlot[];
}

export default function useFetchAvailability(doctorId: string, availableDates: string[]) {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId || availableDates.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 useFetchAvailability: Iniciando fetch para doctorId:', doctorId);
        console.log('🔍 useFetchAvailability: Fechas disponibles:', availableDates);
        
        const availabilityPromises = availableDates.map(date => 
          DoctorService.getDoctorAvailability(doctorId, date)
        );
        
        const results = await Promise.all(availabilityPromises);
        console.log('🔍 useFetchAvailability: Resultados obtenidos:', results);
        
        const processedData: AvailabilityData[] = results.map(result => {
          console.log('🔍 useFetchAvailability: Procesando resultado para fecha:', result.date);
          console.log('🔍 useFetchAvailability: TimeSlots recibidos:', result.timeSlots);
          
          const availableSlots = result.timeSlots.filter(slot => slot.available);
          const occupiedSlots = result.timeSlots.filter(slot => !slot.available);
          
          console.log('🔍 useFetchAvailability: Slots disponibles:', availableSlots);
          console.log('🔍 useFetchAvailability: Slots ocupados:', occupiedSlots);
          
          return {
            date: result.date,
            availableSlots,
            occupiedSlots
          };
        });
        
        console.log('🔍 useFetchAvailability: Datos procesados finales:', processedData);
        setAvailability(processedData);
      } catch (err) {
        console.error('❌ useFetchAvailability: Error fetching availability:', err);
        setError('Error al obtener la disponibilidad del doctor');
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [doctorId, availableDates]);

  return { 
    availability, 
    loading, 
    error,
    // Funciones de utilidad
    getAvailableSlots: (date: string) => {
      const dayData = availability.find(d => d.date === date);
      return dayData?.availableSlots || [];
    },
    getOccupiedSlots: (date: string) => {
      const dayData = availability.find(d => d.date === date);
      return dayData?.occupiedSlots || [];
    }
  };
}