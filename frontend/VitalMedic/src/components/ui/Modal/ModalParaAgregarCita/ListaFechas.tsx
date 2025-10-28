import { cn } from "clsx-for-tailwind";
import { useContext } from "react";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import useFetchFecha from "../../../../hooks/useFetchFecha";
import BotonParaCitas from "../../Buttons/BotonParaCitas";

interface FechaProps {
  fecha: string;
  hora?: string;
}
const Fecha = ({ fecha, hora }: FechaProps) => {
  const { state, dispatch } = useContext(ContextoRegistrarCita);

  let selecionado = false;
  const fechaSelecionado = state.datosParaRegistrarCita.fecha;

  if (fechaSelecionado === fecha) {
    selecionado = true;
  }

  const manejarClick = () => {
    dispatch({ type: "cambiar-fecha-a", payload: fecha });
  };

  return (
    <BotonParaCitas
      variante="fecha"
      selecionado={selecionado}
      onClick={manejarClick}
    >
      <b>{fecha}</b>
      <p>{hora}</p>
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
    <Fecha key={`fecha-${fecha.date}`} fecha={fecha.date} hora="12:00 a.m." />
  ));

  return Lista;
};

export default ListaFechas;
