import { cn } from "clsx-for-tailwind";
import { useReducer } from "react";
import { toggleNewAppointment } from "../../../../features/modal/modalSlice";
import { useAppDispatch } from "../../../../hooks/reduxHooks";
import SingleButton from "../../Buttons/SingleButton";
import BotonParaCitas from "./BotonParaCitas";
import ContenidoDeEstado from "./ContenidoDeEstado";
import Especialidad from "./Especialidad";
import Fecha from "./Fecha";
import Progreso from "./Progreso";
import { reducer, type State } from "./reduce";
import TarjetaDeMedico from "./TarjetaDeMedico";

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

const listaDeEspecialidades = [
  "Cardiología",
  "Pediatría",
  "Dermotología",
  "Medicinal general",
  "Neurología",
  "Traumatología",
];

const estadoInicial: State = {
  progreso: [
    { etiqueta: "Especialidad", estado: "actual" },
    { etiqueta: "Doctor", estado: "pendiente" },
    { etiqueta: "Tipo de cita", estado: "pendiente" },
    { etiqueta: "Fecha", estado: "pendiente" },
  ],
  estadoActual: 0,
};

const ModalParaAgregarCita = () => {
  const dispatchAddAppoinmentModal = useAppDispatch();
  const [state, dispatch] = useReducer(reducer, estadoInicial);

  return (
    <div className={cn(ESTILO_DE_FONDO)}>
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
        <h2 className={cn("h-9 text-2xl")}>
          Agendar nueva cita {state.estadoActual}
        </h2>

        {/* Contenido principal */}
        <div title="Tipo de cita" className={cn(ESTILO_CONTENIDO_PRINCIPAL)}>
          <Progreso etiquetasEstados={state.progreso} />

          <ContenidoDeEstado
            variante="especialidad"
            estado={{ actual: state.estadoActual, requerido: 0 }}
          >
            {listaDeEspecialidades.map((especialidad) => (
              <Especialidad key={`especialidad-${especialidad}`}>
                {especialidad}
              </Especialidad>
            ))}
          </ContenidoDeEstado>

          <ContenidoDeEstado
            variante="medico-o-fecha"
            estado={{ actual: state.estadoActual, requerido: 1 }}
          >
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
            <TarjetaDeMedico
              nombre="Dr. Mata Sanos"
              especialidad="Médico general"
            />
          </ContenidoDeEstado>

          <ContenidoDeEstado
            variante="tipo-cita"
            estado={{ actual: state.estadoActual, requerido: 2 }}
          >
            <BotonParaCitas variante="tipo-de-cita">
              <div className={cn("w-7 h-7", "bg-blue-500")}></div>
              <b>Presencial</b>
            </BotonParaCitas>
            <BotonParaCitas variante="tipo-de-cita">
              <div className={cn("w-7 h-7", "bg-blue-500")}></div>
              <b>Virtual</b>
            </BotonParaCitas>
          </ContenidoDeEstado>

          <ContenidoDeEstado
            variante="medico-o-fecha"
            estado={{ actual: state.estadoActual, requerido: 3 }}
          >
            <Fecha fecha="23 octubre" hora="4:00 P.M" />
            <Fecha fecha="23 octubre" hora="2:00 A.M" />
            <Fecha fecha="23 octubre" hora="4:30 P.m" />
            <Fecha fecha="23 octubre" hora="1:00 P.M" />
          </ContenidoDeEstado>

          <div className={cn("w-full", "flex justify-between")}>
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
                dispatch({ type: "mover-a-la-derecha" });
              }}
            >
              Aceptar
            </SingleButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModalParaAgregarCita;
