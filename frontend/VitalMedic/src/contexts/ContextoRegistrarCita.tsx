import { createContext } from "react";
import type {
  Action,
  State,
} from "../components/ui/Modal/ModalParaAgregarCita/reduce";

interface T_Context {
  state: State;
  dispatch: (action: Action) => void;
}
export const ContextoRegistrarCita = createContext({} as T_Context);
