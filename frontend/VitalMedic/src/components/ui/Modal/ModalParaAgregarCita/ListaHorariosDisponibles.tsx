import { cn } from "clsx-for-tailwind";
import { useContext, useEffect, useState } from "react";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import { DoctorService } from "../../../../services/doctorService";
import useFetchAvailability from "../../../../hooks/useFetchAvailability";
import BotonParaCitas from "../../Buttons/BotonParaCitas";

interface TimeSlotProps {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

const TimeSlotButton = ({ date, startTime, available }: Omit<TimeSlotProps, 'endTime'>) => {
  const { state, dispatch } = useContext(ContextoRegistrarCita);

  const isSelected = 
    state.datosParaRegistrarCita.fecha === date && 
    state.datosParaRegistrarCita.hora === startTime;

  const handleClick = () => {
    if (!available) return; // No permitir seleccionar horarios ocupados
    
    dispatch({
      type: "cambiar-fecha-y-hora-a",
      payload: {
        fecha: date,
        hora: startTime,
      },
    });
  };

  return (
    <BotonParaCitas
      variante="fecha"
      selecionado={isSelected}
      onClick={handleClick}
      disabled={!available}
      className={cn(
        !available && "opacity-50 cursor-not-allowed bg-red-100 text-red-600",
        available && "hover:bg-blue-50"
      )}
    >
      <span>{startTime}</span>
      <span className="text-xs">
        {available ? "Disponible" : "Ocupado"}
      </span>
    </BotonParaCitas>
  );
};

const ListaHorariosDisponibles = () => {
  const { state } = useContext(ContextoRegistrarCita);
  const doctorId = state.datosParaRegistrarCita?.doctor?.id;
  
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);

  // Obtener fechas disponibles del doctor
  useEffect(() => {
    if (!doctorId) {
      setLoadingDates(false);
      return;
    }

    const fetchDates = async () => {
      setLoadingDates(true);
      try {
        const dates = await DoctorService.getAvailableDates(doctorId, 30);
        setAvailableDates(dates);
      } catch (error) {
        console.error('Error fetching available dates:', error);
        setAvailableDates([]);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchDates();
  }, [doctorId]);

  // Obtener availability para las fechas disponibles
  const { availability, loading: loadingAvailability, error } = useFetchAvailability(
    doctorId || "", 
    availableDates
  );

  if (loadingDates || loadingAvailability) {
    return <p className={cn("text-xl text-gray-300 font-bold")}>Cargando horarios...</p>;
  }

  if (error) {
    return (
      <p className={cn("text-xl text-red-500 font-bold")}>
        Error: {error}
      </p>
    );
  }

  if (availability.length === 0) {
    return (
      <p className={cn("text-xl text-gray-300 font-bold")}>
        No hay horarios disponibles para este doctor
      </p>
    );
  }

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {availability.map((dayData) => {
        const allSlots = [...dayData.availableSlots, ...dayData.occupiedSlots]
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        if (allSlots.length === 0) return null;

        return (
          <div
            key={`date-${dayData.date}`}
            className={cn("w-full border-b pb-3", "flex flex-col gap-2")}
          >
            <h3 className={cn("text-lg font-bold text-gray-800")}>
              {new Date(dayData.date + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            
            {/* Horarios disponibles */}
            {dayData.availableSlots.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-600 mb-2">
                  Horarios Disponibles ({dayData.availableSlots.length})
                </h4>
                <div className={cn("flex flex-wrap gap-2")}>
                  {dayData.availableSlots.map((slot, index) => (
                    <TimeSlotButton
                      key={`available-${dayData.date}-${slot.startTime}-${index}`}
                      date={dayData.date}
                      startTime={slot.startTime}
                      available={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Horarios ocupados */}
            {dayData.occupiedSlots.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-600 mb-2">
                  Horarios Ocupados ({dayData.occupiedSlots.length})
                </h4>
                <div className={cn("flex flex-wrap gap-2")}>
                  {dayData.occupiedSlots.map((slot, index) => (
                    <TimeSlotButton
                      key={`occupied-${dayData.date}-${slot.startTime}-${index}`}
                      date={dayData.date}
                      startTime={slot.startTime}
                      available={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListaHorariosDisponibles;