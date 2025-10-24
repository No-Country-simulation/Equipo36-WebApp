import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";

const ESTILO_ESPECIALIDAD = ["w-full", "grid grid-cols-3 gap-3"];
const ESTILO_MEDICO = ["w-full", "flex flex-wrap justify-around gap-y-2.5"];
const ESTILO_TIPO_CITA = ["flex gap-5"];

interface Props {
  variante: "especialidad" | "medico-o-fecha" | "tipo-cita";
  children: ReactNode;
  estado: {
    actual: number;
    requerido: number;
  };
}
const ContenidoDeEstado = ({ variante, children, estado }: Props) => {
  if (estado.actual !== estado.requerido) return null;

  return (
    <div
      className={cn(
        variante === "especialidad" && ESTILO_ESPECIALIDAD,
        variante === "medico-o-fecha" && ESTILO_MEDICO,
        variante === "tipo-cita" && ESTILO_TIPO_CITA,
      )}
    >
      {children}
    </div>
  );
};

export default ContenidoDeEstado;
