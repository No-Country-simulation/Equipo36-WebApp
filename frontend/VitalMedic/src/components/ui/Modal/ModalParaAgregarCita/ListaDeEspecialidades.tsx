import { cn } from "clsx-for-tailwind";
import { useContext } from "react";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import useFetchEspecialidades from "../../../../hooks/useFetchEspecialidades";
import BotonParaCitas from "../../Buttons/BotonParaCitas";

interface EspecialidadProps {
  texto: string;
}
const Especialidad = ({ texto }: EspecialidadProps) => {
  const { state, dispatch } = useContext(ContextoRegistrarCita);

  let selecionado = false;
  const especialidadSelecionada = state.datosParaRegistrarCita.especialidad;

  if (especialidadSelecionada === texto) {
    selecionado = true;
  }

  const manejarClick = () => {
    dispatch({ type: "cambiar-especialidad-a", payload: texto });
  };

  return (
    <BotonParaCitas
      variante="especialidad"
      selecionado={selecionado}
      onClick={manejarClick}
    >
      {texto}
    </BotonParaCitas>
  );
};

const ListaDeEspecialidades = () => {
  const { especialidades, cargando } = useFetchEspecialidades();

  if (cargando) {
    return (
      <p
        className={cn(
          "w-full",
          "text-xl text-gray-300 font-bold",
          "col-span-1 col-start-2",
        )}
      >
        Cargando...
      </p>
    );
  }

  if (especialidades === null) {
    return (
      <p className={cn("text-xl text-gray-300 font-bold")}>
        Error al cargar las especialidades
      </p>
    );
  }

  const Lista = especialidades.map((especialidad) => (
    <Especialidad
      key={`especialidad-${especialidad.id}`}
      texto={especialidad.name}
    />
  ));

  return Lista;
};

export default ListaDeEspecialidades;
