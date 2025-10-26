import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";

const ESTILO_ESPECIALIDAD = [
  "min-w-[200px] h-12",
  "border border-[#E2E8F0] rounded-lg",
  "flex justify-center items-center",
  "hover:bg-blue-200",
  "active:scale-95",
];

const ESTILO_MEDICO = [
  "flex justify-between items-center",
  "w-[290px] h-[70px] px-1",
  "border border-[#E2E8F0] rounded-md",
  "hover:bg-blue-200",
  "active:scale-95",
];

const ESTILO_TIPO_DE_CITA = [
  "w-3xs h-[180px]",
  "rounded-sm border border-[#E2E8F0]",
  "flex flex-col items-center justify-center gap-3.5",
  "hover:bg-blue-200",
  "active:scale-95",
];

const ESTILO_FECHA = [
  "flex flex-col justify-around items-center",
  "w-[180px] h-[56px] px-1",
  "border border-[#E2E8F0] rounded-md",
  "hover:bg-blue-200",
  "active:scale-95",
];

interface Props {
  variante: "especialidad" | "medico" | "tipo-de-cita" | "fecha";
  children: ReactNode;
  selecionado?: boolean;
  onClick?: () => void;
}
const BotonParaCitas = ({
  variante,
  children,
  onClick,
  selecionado = false,
}: Props) => {
  return (
    <button
      className={cn(
        variante === "especialidad" && ESTILO_ESPECIALIDAD,
        variante === "medico" && ESTILO_MEDICO,
        variante === "tipo-de-cita" && ESTILO_TIPO_DE_CITA,
        variante === "fecha" && ESTILO_FECHA,
        selecionado && "bg-blue-200",
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BotonParaCitas;
