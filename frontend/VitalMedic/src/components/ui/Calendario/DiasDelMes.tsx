import { cn } from "clsx-for-tailwind";
import type { DiaProps, DiasDelMesProps } from "./props";

const Dia = ({ dia, indice, esHoy, tipoCita }: DiaProps) => (
  <button
    type="button"
    className={cn(
      "w-11 h-12 p-2 ",
      "text-center text-lg font-semibold cursor-pointer",
      "rounded-lg transition-colors",
      "max-[520px]:w-8 max-[520px]:h-8 max-[520px]:text-sm",
      // Estilo para celdas vacías
      dia === null && "invisible",
      // Estilo general para celdas con número
      dia !== null && "text-gray-800 hover:bg-blue-100",
      // Estilo especial para el día de hoy
      esHoy && "bg-black/50 text-white font-bold hover:bg-black/65",
      // Estilo para los fines de semana (opcional: si el índice es 0 (Dom) o 6 (Sáb))
      (indice % 7 === 0 || indice % 7 === 6) && !esHoy && "text-red-500",
      // Estilo para día con citas precenciales
      tipoCita === "precencial" && "bg-green-500 text-white hover:bg-green-600",
      // Estilo para dias con citas virtuales
      tipoCita === "virtual" && "bg-purple-500 text-white hover:bg-purple-600",
    )}
    // Opcional: añadir un onClick para seleccionar un día
    // onClick={() => day !== null && console.log(`Día seleccionado: ${day}`)}
  >
    {dia}
  </button>
);

const DiasDelMes = ({
  celdasDelCalendario,
  mesActual,
  añoActual,
  diasConCita,
}: DiasDelMesProps) => {
  return (
    <div className={cn("grid grid-cols-7 gap-1")}>
      {celdasDelCalendario.map((dia, indice) => {
        // Determinar si es la fecha de hoy
        const esHoy =
          dia !== null &&
          dia === new Date().getDate() &&
          mesActual === new Date().getMonth() &&
          añoActual === new Date().getFullYear();

        // Determina el tipo de cita
        let tipoCita: "precencial" | "virtual" | null = null;
        if (dia !== null) {
          if (diasConCita.precencial.includes(dia)) {
            tipoCita = "precencial";
          }

          if (diasConCita.virtual.includes(dia)) {
            tipoCita = "virtual";
          }
        }

        return (
          <Dia
            key={`calendar-${dia}-${indice + 2}`}
            dia={dia}
            indice={indice}
            esHoy={esHoy}
            tipoCita={tipoCita}
          />
        );
      })}
    </div>
  );
};

export default DiasDelMes;
