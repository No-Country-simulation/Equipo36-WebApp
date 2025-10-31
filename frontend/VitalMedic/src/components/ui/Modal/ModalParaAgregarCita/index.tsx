import { cn } from "clsx-for-tailwind";
import { useReducer } from "react";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import { toggleNewAppointment } from "../../../../features/modal/modalSlice";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import { usePatientData } from "../../../../hooks/usePatientData";

import { AppointmentService, type CreateAppointmentRequest } from "../../../../services/appointmentService";
import SingleButton from "../../Buttons/SingleButton";
import ContenidoDeEstado from "./ContenidoDeEstado";
import DatosAEnviar from "./DatosAEviar";
import ListaDeEspecialidades from "./ListaDeEspecialidades";
import ListaDeMedicos from "./ListaDeMedicos";
import ListaHorariosDisponibles from "./ListaHorariosDisponibles";
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
    hora: null,
    tipoDeCita: null,
  },
};

const ModalParaAgregarCita = () => {
  const dispatchAddAppoinmentModal = useAppDispatch();
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  const { patientData, loading: patientLoading } = usePatientData();
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  // const accessToken = useAppSelector((state) => state.auth.keycloak?.token);

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
              variante="medico"
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
              variante="fecha"
              estado={{ actual: state.estadoActual, requerido: 3 }}
            >
              <ListaHorariosDisponibles />
            </ContenidoDeEstado>

            <ContenidoDeEstado
              variante="envio"
              estado={{ actual: state.estadoActual, requerido: 4 }}
            >
              <DatosAEnviar />
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
                            state.datosParaRegistrarCita.doctor === null
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
                <SingleButton
                  variant="primary"
                  onClick={async () => {
                    // Validar que todos los datos requeridos estén presentes
                    if (!state.datosParaRegistrarCita.doctor?.id) {
                      alert("Por favor selecciona un doctor");
                      return;
                    }
                    
                    if (!state.datosParaRegistrarCita.fecha) {
                      alert("Por favor selecciona una fecha");
                      return;
                    }
                    
                    if (!state.datosParaRegistrarCita.hora) {
                      alert("Por favor selecciona una hora");
                      return;
                    }
                    
                    if (!state.datosParaRegistrarCita.tipoDeCita) {
                      alert("Por favor selecciona un tipo de cita");
                      return;
                    }

                    // La fecha ya viene en formato ISO (YYYY-MM-DD) desde el estado
                    const fechaFormateada = state.datosParaRegistrarCita.fecha;
                    if (!fechaFormateada) {
                      alert("Error: fecha no válida. Por favor intenta de nuevo.");
                      return;
                    }

                    // Mapear el tipo de cita al formato esperado por el backend
                    const tipoMapeado = state.datosParaRegistrarCita.tipoDeCita.toLowerCase() === 'presencial' 
                      ? 'PRESENTIAL' 
                      : 'VIRTUAL';

                    // Formatear la hora al formato HH:mm (sin segundos) que espera el backend
                    const horaFormateada = state.datosParaRegistrarCita.hora.substring(0, 5); // "15:30:00" -> "15:30"

                    // Validar que tenemos los datos del paciente
                    // Usar patientData.id si está disponible, sino usar userProfile.id como fallback
                    const patientId = patientData?.id || userProfile?.id;
                    
                    if (!patientId) {
                      alert("Error: No se pudo obtener la información del paciente. Por favor, recarga la página e intenta de nuevo.");
                      return;
                    }

                    const appointmentData: CreateAppointmentRequest = {
                      doctorId: state.datosParaRegistrarCita.doctor.id,
                      patientId: patientId,
                      date: fechaFormateada,
                      startTime: horaFormateada,
                      type: tipoMapeado as 'PRESENTIAL' | 'VIRTUAL',
                    };

                    console.log("Datos a enviar:", appointmentData);
                    console.log("Estado completo:", state.datosParaRegistrarCita);
                    console.log("Datos del paciente:", patientData);
                    console.log("UserProfile ID usado como fallback:", userProfile?.id);

                    try {
                      const result = await AppointmentService.createAppointment(appointmentData);
                      console.log("Cita creada exitosamente:", result);
                      alert("Cita registrada exitosamente");
                      dispatchAddAppoinmentModal(toggleNewAppointment());
                    } catch (error) {
                      console.error("Error al crear la cita:", error);
                      alert("Error al registrar la cita. Por favor intenta de nuevo.");
                    }
                  }}
                >
                  {patientLoading ? "Cargando..." : "Registrar cita"}
                </SingleButton>
              )}
            </div>
          </div>
        </section>
      </ContextoRegistrarCita.Provider>
    </div>
  );
};

export default ModalParaAgregarCita;
