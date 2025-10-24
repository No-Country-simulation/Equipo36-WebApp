import { cn } from "clsx-for-tailwind";
import perfil from "../../../../assets/images/perfil.jpg";
import BotonParaCitas from "./BotonParaCitas";

const ESTILO_MEDICO_DIV = [
  "w-[calc(100%_-_56px)] h-full",
  "flex flex-col justify-around items-center",
];
const ESTILO_MEDICO_IMG = [
  "w-[56px] h-[56px]",
  "border border-stone-200 rounded-full",
];

interface Props {
  nombre: string;
  especialidad: string;
  fotoDePerfil?: string;
}
const TarjetaDeMedico = ({
  nombre,
  especialidad,
  fotoDePerfil = perfil,
}: Props) => {
  return (
    <BotonParaCitas variante="medico">
      <div className={cn(ESTILO_MEDICO_DIV)}>
        <p className={cn("text-lg font-bold")}>{nombre}</p>
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

export default TarjetaDeMedico;
