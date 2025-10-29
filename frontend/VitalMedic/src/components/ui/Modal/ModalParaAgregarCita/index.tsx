import { cn } from "clsx-for-tailwind";
import { useReducer } from "react";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import { toggleNewAppointment } from "../../../../features/modal/modalSlice";
import { useAppDispatch } from "../../../../hooks/reduxHooks";
import SingleButton from "../../Buttons/SingleButton";
import ContenidoDeEstado from "./ContenidoDeEstado";
import ListaDeEspecialidades from "./ListaDeEspecialidades";
import ListaDeMedicos from "./ListaDeMedicos";
import ListaFechas from "./ListaFechas";
import Progreso from "./Progreso";
import { reducer, type State } from "./reduce";
import TipoDeCita from "./TipoDeCita";

const ESTILO_DE_FONDO = [
  "absolute top-0 leading-0",
  "w-screen h-full pt-12 bg-black/15",
  "flex justify-center items-start",
];
const ESTILO_AGREGAR_CITA = [
  "w-[840px] h-[540px] py-5 px-3 bg-white",
  "flex flex-col justify-between items-center",
  "rounded-sm",
];
const ESTILO_CONTENIDO_PRINCIPAL = [
  "w-full h-[calc(100%_-_70px)] t-2",
  "border-t border-[#E5E7EB]",
  "flex flex-col justify-between items-center",
];

const estadoInicial: State = {
  progreso: [
    { etiqueta: "Especialidad", estado: "actual" },
    { etiqueta: "Doctor", estado: "pendiente" },
    { etiqueta: "Tipo de cita", estado: "pendiente" },
    { etiqueta: "Fecha", estado: "pendiente" },
  ],
  estadoActual: 0,
  especialidades: [],
  datosParaRegistrarCita: {
    especialidad: null,
    doctor: null,
    fecha: null,
    tipoDeCita: null,
  },
};

const ModalParaAgregarCita = () => {
  const dispatchAddAppoinmentModal = useAppDispatch();
  const [state, dispatch] = useReducer(reducer, estadoInicial);

  return (
    <div className={cn(ESTILO_DE_FONDO)}>
      <ContextoRegistrarCita.Provider
        value={{ state: state, dispatch: dispatch }}
      >
        <section className={cn(ESTILO_AGREGAR_CITA)}>
          {/* Grupo de botones superiores */}
          <div className={cn("w-full flex justify-end items-center")}>
            <SingleButton
              variant="secondary"
              onClick={() => {
                dispatchAddAppoinmentModal(toggleNewAppointment());
              }}
            >
              Cerrar
            </SingleButton>
          </div>

          {/* Titulo */}
          <h2 className={cn("h-9 text-2xl")}>Agendar nueva cita</h2>

          {/* Contenido principal */}
          <div title="Tipo de cita" className={cn(ESTILO_CONTENIDO_PRINCIPAL)}>
            <Progreso etiquetasEstados={state.progreso} />

            <ContenidoDeEstado
              variante="especialidad"
              estado={{ actual: state.estadoActual, requerido: 0 }}
            >
              <ListaDeEspecialidades />
            </ContenidoDeEstado>

            <ContenidoDeEstado
              variante="medico-o-fecha"
              estado={{ actual: state.estadoActual, requerido: 1 }}
            >
              <ListaDeMedicos />
            </ContenidoDeEstado>

            <ContenidoDeEstado
              variante="tipo-cita"
              estado={{ actual: state.estadoActual, requerido: 2 }}
            >
              <TipoDeCita lista={["Presencial", "Virtual"]} />
            </ContenidoDeEstado>

            <ContenidoDeEstado
              variante="medico-o-fecha"
              estado={{ actual: state.estadoActual, requerido: 3 }}
            >
              <ListaFechas />
            </ContenidoDeEstado>

            <ContenidoDeEstado
              variante="envio"
              estado={{ actual: state.estadoActual, requerido: 4 }}
            >
              <div className={cn("flex gap-1")}>
                <b>Especialidad:</b>
                <p>{state.datosParaRegistrarCita.especialidad}</p>
              </div>
              <div className={cn("flex gap-1")}>
                <b>Doctor:</b>
                <p>{state.datosParaRegistrarCita?.doctor?.nombre}</p>
              </div>
              <div className={cn("flex gap-1")}>
                <b>Tipo:</b>
                <p>{state.datosParaRegistrarCita.tipoDeCita}</p>
              </div>
              <div className={cn("flex gap-1")}>
                <b>Fecha:</b>
                <p>{state.datosParaRegistrarCita.fecha}</p>
              </div>
            </ContenidoDeEstado>

            <div
              className={cn(
                "w-full",
                "flex justify-between",
                state.estadoActual === 4 && "justify-center",
              )}
            >
              {state.estadoActual !== 4 && (
                <>
                  <SingleButton
                    variant="tertiary"
                    onClick={() => {
                      dispatch({ type: "mover-a-la-izquierda" });
                    }}
                  >
                    ← Volver
                  </SingleButton>
                  <SingleButton
                    onClick={() => {
                      switch (state.estadoActual) {
                        case 0:
                          if (
                            state.datosParaRegistrarCita.especialidad === null
                          ) {
                            alert("Debe escojer una opción");
                            break;
                          }

                          dispatch({ type: "mover-a-la-derecha" });
                          break;

                        case 1:
                          if (
                            state.datosParaRegistrarCita?.doctor?.id === null
                          ) {
                            alert("Debe escojer una opción");
                            break;
                          }

                          dispatch({ type: "mover-a-la-derecha" });
                          break;
                        case 2:
                          if (
                            state.datosParaRegistrarCita.tipoDeCita === null
                          ) {
                            alert("Debe escojer una opción");
                            break;
                          }

                          dispatch({ type: "mover-a-la-derecha" });
                          break;

                        case 3:
                          if (state.datosParaRegistrarCita.fecha === null) {
                            alert("Debe escojer una opción");
                            break;
                          }

                          dispatch({ type: "mover-a-la-derecha" });
                          break;
                      }
                    }}
                  >
                    Aceptar
                  </SingleButton>
                </>
              )}

              {state.estadoActual === 4 && (
                <SingleButton variant="primary">Registrar cita</SingleButton>
              )}
            </div>
          </div>
        </section>
      </ContextoRegistrarCita.Provider>
    </div>
  );
};

export default ModalParaAgregarCita;
