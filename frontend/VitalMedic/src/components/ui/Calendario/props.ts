import type { ReactNode } from "react";

export type Citas = {
  precencial: number[];
  virtual: number[];
};
export interface CalendarioProps {
  // Puedes aceptar una fecha inicial, si es necesario
  fechaInicial?: Date;
  mesesConCita: Record<string, Citas>;
}

export interface DiaProps {
  dia: number | null;
  esHoy: boolean;
  indice: number;
  tipoCita: "precencial" | "virtual" | null;
}

export interface DiasDelMesProps {
  celdasDelCalendario: (number | null)[];
  mesActual: number;
  añoActual: number;
  diasConCita: Citas;
}

export interface BotonDeNavegacionProps {
  onClick: () => void;
  children: ReactNode;
}
