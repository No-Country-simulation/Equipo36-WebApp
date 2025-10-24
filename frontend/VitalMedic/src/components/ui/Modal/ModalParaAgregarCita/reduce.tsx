type Estado = "pendiente" | "actual" | "hecho";
export interface State {
  progreso: { etiqueta: string; estado: Estado }[];
  estadoActual: number;
}
type Action =
  | { type: "mover-a-la-derecha" }
  | { type: "mover-a-la-izquierda" }
  | { type: "cambiar-estado-actual"; payload: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "mover-a-la-derecha": {
      const indiceParaActualizar = state.progreso.findIndex(
        (prg) => prg.estado === "actual",
      );

      if (indiceParaActualizar === -1) {
        return state; // No hay nada que mover
      }

      let nuevoEstadoActual = indiceParaActualizar;

      const nuevoProgreso = [...state.progreso];

      if (state.estadoActual >= 3) {
        nuevoProgreso[indiceParaActualizar] = {
          ...nuevoProgreso[indiceParaActualizar],
          estado: "hecho",
        };

        return { progreso: nuevoProgreso, estadoActual: 4 };
      }

      if (indiceParaActualizar < 3) {
        nuevoProgreso[indiceParaActualizar + 1] = {
          ...nuevoProgreso[indiceParaActualizar + 1],
          estado: "actual",
        };

        nuevoEstadoActual++;
      }

      nuevoProgreso[indiceParaActualizar] = {
        ...nuevoProgreso[indiceParaActualizar],
        estado: "hecho",
      };

      return { progreso: nuevoProgreso, estadoActual: nuevoEstadoActual };
    }

    case "mover-a-la-izquierda": {
      const indiceParaActualizar = state.progreso.findIndex(
        (prg) => prg.estado === "actual",
      );

      if (indiceParaActualizar === -1) {
        return state; // No hay nada que mover
      }

      let nuevoEstadoActual = indiceParaActualizar;
      const nuevoProgreso = [...state.progreso];

      if (indiceParaActualizar > 0) {
        nuevoProgreso[indiceParaActualizar] = {
          ...nuevoProgreso[indiceParaActualizar],
          estado: "pendiente",
        };

        nuevoProgreso[indiceParaActualizar - 1] = {
          ...nuevoProgreso[indiceParaActualizar - 1],
          estado: "actual",
        };

        nuevoEstadoActual--;
      }

      return {
        progreso: nuevoProgreso,
        estadoActual: nuevoEstadoActual,
      };
    }

    default:
      return state;
  }
};
