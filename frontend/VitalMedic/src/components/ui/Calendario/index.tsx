import { cn } from "clsx-for-tailwind";
import { useMemo, useState } from "react";
import BotonDeNavegacion from "./BontonDeNavegacion";
import DiasDelMes from "./DiasDelMes";
import type { CalendarioProps } from "./props";

const DIAS_DE_LA_SEMANA = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
] as const;

const Calendario = ({
  fechaInicial = new Date(),
  mesesConCita,
}: CalendarioProps) => {
  // Estado que mantiene la fecha visible en el calendario
  const [fechaActual, setFechaActual] = useState<Date>(fechaInicial);
  const mesActual = useMemo(() => fechaActual.getMonth(), [fechaActual]);
  const añoActual = useMemo(() => fechaActual.getFullYear(), [fechaActual]);

  // Memoizar la matriz de celdas del calendario para evitar recálculos innecesarios
  const celdasDelCalendario = useMemo(() => {
    // Obtener número de días en el mes actual (día 0 del siguiente mes => último día del mes actual)
    const diasEnMes = new Date(añoActual, mesActual + 1, 0).getDate();

    // Día de la semana en que comienza el mes (0=Dom, 1=Lun, ...)
    const diaSemanaInicio = new Date(añoActual, mesActual, 1).getDay();

    const celdas: (number | null)[] = [];

    // Relleno inicial con celdas vacías
    for (let i = 0; i < diaSemanaInicio; i++) {
      celdas.push(null);
    }
    // Días reales del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      celdas.push(dia);
    }

    return celdas;
  }, [mesActual, añoActual]);

  // Navegación entre meses
  const irAlMesAnterior = () => {
    setFechaActual(new Date(añoActual, mesActual - 1, 1));
  };

  const irAlProximoMes = () => {
    setFechaActual(new Date(añoActual, mesActual + 1, 1));
  };

  // Formato del encabezado
  const nombreDelMes = fechaActual.toLocaleString("es-PE", { month: "long" });
  const textDelEncabezado = `${nombreDelMes.charAt(0).toUpperCase() + nombreDelMes.slice(1)} ${añoActual}`;

  // Obtener días con cita de forma robusta:
  // - intenta con el nombre en minúsculas (p. ej. "marzo")
  // - si no existe, intenta con el índice del mes como string ("0".."11")
  // - en último caso, fallback vacío
  const diasConCita = mesesConCita[nombreDelMes.toLowerCase()] ?? {
    precencial: [],
    virtual: [],
  };

  return (
    <div
      className={cn(
        "w-[450px]",
        "bg-white p-4 rounded-xl shadow-2xl",
        "font-sans",
        "max-[520px]:w-[280px]",
      )}
    >
      {/* Encabezado del Mes y Navegación */}
      <div
        className={cn(
          "flex justify-between items-center",
          "mb-4 p-2 border-b-2 border-gray-100",
        )}
      >
        <BotonDeNavegacion onClick={irAlMesAnterior}>&lt;</BotonDeNavegacion>
        <h3
          className={cn(
            "text-xl font-bold text-gray-800 capitalize",
            "max-[520px]:text-lg",
          )}
        >
          {textDelEncabezado}
        </h3>
        <BotonDeNavegacion onClick={irAlProximoMes}>&gt;</BotonDeNavegacion>
      </div>

      {/* Días de la Semana (Encabezados) */}
      <div
        className={cn(
          "grid grid-cols-7 gap-1",
          "text-center text-sm font-semibold text-gray-500",
        )}
      >
        {DIAS_DE_LA_SEMANA.map((day) => (
          <div
            key={day}
            className={cn(
              "p-1.5",
              "font-bold text-[17px]",
              "max-[520px]:text-sm",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Cuadrícula de Días del Mes */}
      <DiasDelMes
        diasConCita={diasConCita}
        celdasDelCalendario={celdasDelCalendario}
        mesActual={mesActual}
        añoActual={añoActual}
      />
    </div>
  );
};

export default Calendario;
