import { cn } from "clsx-for-tailwind";
import { useContext } from "react";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import useFetchFecha from "../../../../hooks/useFetchFecha";
import BotonParaCitas from "../../Buttons/BotonParaCitas";

interface TimeBlock {
  id: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

const DiaAlEspañol: Record<string, string> = {
  MONDAY: "lunes",
  TUESDAY: "martes",
  WEDNESDAY: "miercoles",
  THURSDAY: "jueves",
  FRIDAY: "viernes",
  SATURDAY: "sábado",
  SUNDAY: "domingo",
} as const;

interface FechaProps {
  fecha: string;
  timeBlock: TimeBlock;
}
const Fecha = ({ timeBlock, fecha }: FechaProps) => {
  const { state, dispatch } = useContext(ContextoRegistrarCita);

  let selecionado = false;
  const fechaSelecionada = state.datosParaRegistrarCita.fecha;
  const horaSelecionada = state.datosParaRegistrarCita.hora;

  if (fechaSelecionada === fecha && horaSelecionada === timeBlock.startTime) {
    selecionado = true;
  }

  const manejarClick = () => {
    dispatch({
      type: "cambiar-fecha-y-hora-a",
      payload: {
        fecha: fecha,
        hora: timeBlock.startTime,
      },
    });
  };

  return (
    <BotonParaCitas
      variante="fecha"
      selecionado={selecionado}
      onClick={manejarClick}
    >
      <span>{timeBlock.startTime}</span>
      <span> {timeBlock.endTime}</span>
    </BotonParaCitas>
  );
};

const ListaFechas = () => {
  const { state } = useContext(ContextoRegistrarCita);
  const idDoctor = state.datosParaRegistrarCita?.doctor?.id;
  const { fechas, cargando } = useFetchFecha(idDoctor ?? "");

  if (cargando) {
    return <p className={cn("text-xl text-gray-300 font-bold")}>Cargando...</p>;
  }

  if (fechas === null) {
    return (
      <p className={cn("text-xl text-gray-300 font-bold")}>
        No hay fechas disponibles para esta especialidad
      </p>
    );
  }

  const Lista = fechas.map((fecha) => (
    <div
      key={`dia-de-fecha-${fecha.weekDay}`}
      className={cn("w-full", "flex justify-between items-center")}
    >
      <h3 className={cn("w-[150px]", "text-center font-bold capitalize")}>
        {DiaAlEspañol[fecha.weekDay]}
      </h3>
      <div className={cn("flex justify-start gap-3")}>
        {fecha.timeBlocks.map((horario) => (
          <Fecha
            key={`horaio-${horario.id}`}
            fecha={fecha.weekDay}
            timeBlock={horario}
          />
        ))}
      </div>
    </div>
  ));

  return Lista;
};

export default ListaFechas;
