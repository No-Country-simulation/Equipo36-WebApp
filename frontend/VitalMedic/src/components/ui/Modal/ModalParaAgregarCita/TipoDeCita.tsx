import { cn } from "clsx-for-tailwind";
import BotonParaCitas from "./BotonParaCitas";

const TipoDeCita = () => {
  return (
    <BotonParaCitas variante="tipo-de-cita">
      <div className={cn("w-7 h-7", "bg-blue-500")}></div>
      <b>Presencial</b>
    </BotonParaCitas>
  );
};

export default TipoDeCita;
