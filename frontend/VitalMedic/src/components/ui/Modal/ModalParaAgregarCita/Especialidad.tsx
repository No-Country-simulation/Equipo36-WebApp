import type { ReactNode } from "react";
import BotonParaCitas from "./BotonParaCitas";

interface Props {
  children: ReactNode;
}
const Especialidad = ({ children }: Props) => {
  return <BotonParaCitas variante="especialidad">{children}</BotonParaCitas>;
};

export default Especialidad;
