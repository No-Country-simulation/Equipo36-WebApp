import { cn } from "clsx-for-tailwind";
import { useContext } from "react";
import perfil from "../../../../assets/images/perfil.jpg";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import useFetchDoctores from "../../../../hooks/useFetchDoctores";
import BotonParaCitas from "../../Buttons/BotonParaCitas";

const ESTILO_MEDICO_DIV = [
  "w-[calc(100%_-_56px)] h-full",
  "flex flex-col justify-around items-center",
];
const ESTILO_MEDICO_IMG = [
  "w-[56px] h-[56px]",
  "border border-stone-200 rounded-full",
];

interface TarjetaDeMedicoProps {
  id: string;
  nombre: string;
  especialidad: string;
  fotoDePerfil?: string;
}
const TarjetaDeMedico = ({
  id: idDoctor,
  nombre: nombreDoctor,
  especialidad,
  fotoDePerfil = perfil,
}: TarjetaDeMedicoProps) => {
  const { state, dispatch } = useContext(ContextoRegistrarCita);

  let selecionado = false;
  const idDoctorSelecionado = state.datosParaRegistrarCita?.doctor?.id;

  if (idDoctorSelecionado === idDoctor) {
    selecionado = true;
  }

  const manejarClick = () => {
    dispatch({
      type: "cambiar-doctor-a",
      payload: { id: idDoctor, nombre: nombreDoctor },
    });
  };

  return (
    <BotonParaCitas
      variante="medico"
      selecionado={selecionado}
      onClick={manejarClick}
    >
      <div className={cn(ESTILO_MEDICO_DIV)}>
        <p className={cn("text-lg font-bold")}>{nombreDoctor}</p>
        <p className={cn("text-sm")}>{especialidad}</p>
      </div>
      <img
        className={cn(ESTILO_MEDICO_IMG)}
        src={fotoDePerfil}
        alt="Foto del médico"
      />
    </BotonParaCitas>
  );
};

const ListaDeMedicos = () => {
  const { doctores, cargando } = useFetchDoctores();
  const { state } = useContext(ContextoRegistrarCita);

  if (cargando) {
    return <p className={cn("text-xl text-gray-300 font-bold")}>Cargando...</p>;
  }

  if (doctores === null) {
    return (
      <p className={cn("text-xl text-gray-300 font-bold")}>
        Error al cargar las especialidades
      </p>
    );
  }

  const listaFiltrada = doctores.filter(
    (filtro) => filtro.specialty === state.datosParaRegistrarCita.especialidad,
  );

  if (listaFiltrada.length === 0) {
    return (
      <p className={cn("text-xl text-gray-300 font-bold")}>
        No hay doctor para esta especialidad
      </p>
    );
  }

  return (
    <>
      {listaFiltrada.map((medico) => (
        <TarjetaDeMedico
          key={`tarjeta-medico-${medico.id}`}
          id={medico.id}
          nombre={`Dr. ${medico.firstName} ${medico.lastName}`}
          especialidad={medico.specialty}
        />
      ))}
    </>
  );
};

export default ListaDeMedicos;
