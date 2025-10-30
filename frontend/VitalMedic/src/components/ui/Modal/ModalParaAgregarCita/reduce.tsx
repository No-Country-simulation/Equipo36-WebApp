import type { T_Especialidad } from "../../../../types/agregarCita";

type Estado = "pendiente" | "actual" | "hecho";
export interface State {
  progreso: { etiqueta: string; estado: Estado }[];
  estadoActual: number;
  especialidades: T_Especialidad[];
  datosParaRegistrarCita: {
    especialidad: string | null;
    doctor: { id: string | null; nombre: string | null } | null;
    tipoDeCita: string | null;
    fecha: string | null;
    hora: string | null;
  };
}
export type Action =
  | { type: "mover-a-la-derecha" }
  | { type: "mover-a-la-izquierda" }
  // | { type: "cambiar-estado-actual"; payload: number }
  | { type: "inicializar-especialidades"; payload: T_Especialidad[] }
  | { type: "cambiar-especialidad-a"; payload: string }
  | { type: "cambiar-doctor-a"; payload: { id: string; nombre: string } }
  | { type: "cambiar-tipo-cita-a"; payload: string }
  | {
      type: "cambiar-fecha-y-hora-a";
      payload: { fecha: string; hora: string };
    };

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

        return { ...state, progreso: nuevoProgreso, estadoActual: 4 };
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

      return {
        ...state,
        progreso: nuevoProgreso,
        estadoActual: nuevoEstadoActual,
      };
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
        ...state,
        progreso: nuevoProgreso,
        estadoActual: nuevoEstadoActual,
      };
    }

    case "inicializar-especialidades": {
      return { ...state, especialidades: action.payload };
    }

    case "cambiar-especialidad-a": {
      const nuevaEspecialidad = action.payload;

      const datosDeRegistroActualizado = {
        ...state.datosParaRegistrarCita,
        especialidad: nuevaEspecialidad,
      };

      return { ...state, datosParaRegistrarCita: datosDeRegistroActualizado };
    }

    case "cambiar-doctor-a": {
      const nuevoDoctor = action.payload;

      const datosDeRegistroActualizado = {
        ...state.datosParaRegistrarCita,
        doctor: { ...nuevoDoctor },
      };

      return { ...state, datosParaRegistrarCita: datosDeRegistroActualizado };
    }

    case "cambiar-tipo-cita-a": {
      const nuevoTipoDeCita = action.payload;

      const datosDeRegistroActualizado = {
        ...state.datosParaRegistrarCita,
        tipoDeCita: nuevoTipoDeCita,
      };

      return { ...state, datosParaRegistrarCita: datosDeRegistroActualizado };
    }

    case "cambiar-fecha-y-hora-a": {
      const nuevaFecha = action.payload.fecha;
      const nuevaHora = action.payload.hora;

      const datosDeRegistroActualizado = {
        ...state.datosParaRegistrarCita,
        fecha: nuevaFecha,
        hora: nuevaHora,
      };

      return { ...state, datosParaRegistrarCita: datosDeRegistroActualizado };
    }

    default:
      return state;
  }
};
