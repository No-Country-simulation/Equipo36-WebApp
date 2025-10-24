import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";

const ESTILO_ETIQUETA = [
  "min-w-36 h-11",
  "flex justify-center items-center",
  "rounded-lg",
];

interface EtiquetaProps {
  children: ReactNode;
  estiloDeEstado?: "pendiente" | "actual" | "hecho";
}
const Etiqueta = ({
  children,
  estiloDeEstado = "pendiente",
}: EtiquetaProps) => {
  return (
    <div
      className={cn(
        ESTILO_ETIQUETA,
        estiloDeEstado === "pendiente" && ["text-[#99A1AF]", "bg-[#F3F4F6]"],
        estiloDeEstado === "actual" && ["bg-[#155DFC] text-white"],
        estiloDeEstado === "hecho" && [
          "bg-[#ECFDF5] text-[#007A55] border border-[#5EE9B5]",
        ],
      )}
    >
      <p className={cn("font-semibold")}>{children}</p>
    </div>
  );
};

interface ProgresoProps {
  etiquetasEstados: {
    etiqueta: string;
    estado: "actual" | "pendiente" | "hecho";
  }[];
}
const Progreso = ({ etiquetasEstados }: ProgresoProps) => {
  return (
    <div className={cn("w-full mt-6", "flex justify-around")}>
      {etiquetasEstados.map((dato, index) => (
        <Etiqueta
          key={`progreso-${dato.etiqueta}`}
          estiloDeEstado={dato.estado}
        >
          {index + 1}. {dato.etiqueta}
        </Etiqueta>
      ))}
    </div>
  );
};

export default Progreso;
