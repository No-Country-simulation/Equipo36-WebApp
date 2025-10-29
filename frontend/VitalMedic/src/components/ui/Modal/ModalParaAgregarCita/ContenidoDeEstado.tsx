import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";

const ESTILO_ESPECIALIDAD = ["w-full", "grid grid-cols-3 gap-3"];
const ESTILO_MEDICO = ["w-full", "flex flex-wrap justify-around gap-y-2.5"];
const ESTILO_TIPO_CITA = ["flex gap-5"];
const ESTILO_DE_ENVIO = [
  "w-full",
  "flex flex-col items-center flex-wrap gap-10",
];

interface Props {
  variante: "especialidad" | "medico-o-fecha" | "tipo-cita" | "envio";
  children: ReactNode;
  cargandoContenido?: boolean;
  estado: {
    actual: number;
    requerido: number;
  };
}
const ContenidoDeEstado = ({
  variante,
  children,
  estado,
  cargandoContenido = false,
}: Props) => {
  if (estado.actual !== estado.requerido) return null;

  if (cargandoContenido) {
    return (
      <div className={cn("w-full h-10", "flex justify-center items-center")}>
        <h2 className={cn("text-2xl animate-ping")}>Cargando...</h2>
      </div>
    );
  }

  return (
    <div
      className={cn(
        variante === "especialidad" && ESTILO_ESPECIALIDAD,
        variante === "medico-o-fecha" && ESTILO_MEDICO,
        variante === "tipo-cita" && ESTILO_TIPO_CITA,
        variante === "envio" && ESTILO_DE_ENVIO
      )}
    >
      {children}
    </div>
  );
};

export default ContenidoDeEstado;
