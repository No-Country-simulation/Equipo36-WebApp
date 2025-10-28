import { cn } from "clsx-for-tailwind";
import { useContext } from "react";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import BotonParaCitas from "../../Buttons/BotonParaCitas";

interface TipoProps {
  texto: string;
}
const Tipo = ({ texto }: TipoProps) => {
  const { state, dispatch } = useContext(ContextoRegistrarCita);

  let selecionado = false;
  const tipoDeCitaActual = state.datosParaRegistrarCita.tipoDeCita;

  if (texto === tipoDeCitaActual) {
    selecionado = true;
  }

  const manejarClick = () => {
    dispatch({ type: "cambiar-tipo-cita-a", payload: texto });
  };

  return (
    <BotonParaCitas
      variante="tipo-de-cita"
      selecionado={selecionado}
      onClick={manejarClick}
    >
      <div className={cn("w-7 h-7", "bg-blue-500")}></div>
      <b>{texto}</b>
    </BotonParaCitas>
  );
};

interface Props {
  lista: string[];
}
const TipoDeCita = ({ lista }: Props) => {
  const Lista = lista.map((lst) => (
    <Tipo key={`tipo-de-cita-${lst}`} texto={lst} />
  ));

  return Lista;
};

export default TipoDeCita;
