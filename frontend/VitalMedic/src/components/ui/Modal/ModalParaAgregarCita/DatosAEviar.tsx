import { cn } from "clsx-for-tailwind";
import { useContext } from "react";
import { ContextoRegistrarCita } from "../../../../contexts/ContextoRegistrarCita";
import { diaAFecha } from "../../../../utils/fecha";

const DatosAEnviar = () => {
  const { state } = useContext(ContextoRegistrarCita);

  return (
    <>
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
        <p>
          {diaAFecha(state.datosParaRegistrarCita.fecha)}{" "}
          {state.datosParaRegistrarCita.hora}
        </p>
      </div>
    </>
  );
};

export default DatosAEnviar;
