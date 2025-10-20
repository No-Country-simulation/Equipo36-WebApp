import { cn } from "clsx-for-tailwind";
import plusIcon from "../../assets/icons/plus.png";
import SingleButton from "../../components/ui/Buttons/SingleButton";
import Calendario from "../../components/ui/Calendario";
import type { Citas } from "../../components/ui/Calendario/props";
import TarjetaDeActividad from "../../components/ui/TarjetaDeActividad";
import { toggleNewAppointment } from "../../features/modal/modalSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";

const mesesConCita: Record<string, Citas> = {
  octubre: {
    precencial: [4, 10],
    virtual: [2],
  },
  noviembre: {
    precencial: [20],
    virtual: [17, 21],
  },
};

const Appointment = () => {
  const dispatchModal = useAppDispatch();

  const handleButtonShowAppointmentModal = () => {
    dispatchModal(toggleNewAppointment());
  };

  return (
    <>
      <div className={cn("pt-2", "flex justify-between flex-wrap gap-3.5")}>
        <h2 className={cn("text-2xl  font-bold")}>Mis Citas</h2>
        <SingleButton onClick={handleButtonShowAppointmentModal}>
          <img className={cn("w-6 h-6")} src={plusIcon} alt="Ícono de más" />
          Agendar nueva cita
        </SingleButton>
      </div>

      <div
        className={cn(
          "w-full mt-8",
          "flex flex-row justify-around items-start flex-wrap gap-8",
          "max-[520px]:mt-0",
        )}
      >
        {/* Calendario */}
        <div className={cn("min-h-48 mt-12")}>
          <Calendario mesesConCita={mesesConCita} />
          <div className="mt-10">
            <p
              className={cn("w-fit", "flex justify-center items-center gap-1")}
            >
              <b className={cn("w-4 h-4 bg-green-800", "rounded-sm")}></b>{" "}
              Presencial
            </p>
            <p
              className={cn("w-fit", "flex justify-center items-center gap-1")}
            >
              <b className={cn("w-4 h-4 bg-blue-600", "rounded-sm")}></b>{" "}
              Virtual
            </p>
          </div>
        </div>

        {/* Actividades Programadas */}
        <div className={cn("flex flex-col gap-5")}>
          <h3 className={cn("text-2xl")}>Actividades programadas</h3>

          <TarjetaDeActividad
            titulo="Control de presión"
            nombreDeDoctor="Dra. Ana Martinez"
            hora="10:30 AM"
          />
          <TarjetaDeActividad
            titulo="Consulta"
            nombreDeDoctor="Dra. Lucas Martinez"
            hora="02:40 PM"
            tipoDeCita="Virtual"
          />
        </div>
      </div>
    </>
  );
};

export default Appointment;
