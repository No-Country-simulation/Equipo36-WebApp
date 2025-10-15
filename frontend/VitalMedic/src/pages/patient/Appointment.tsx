import { cn } from "clsx-for-tailwind";
import plusIcon from "../../assets/icons/plus.png";
import AppointmentTable from "../../components/ui/AppointmentTable";
import SingleButton from "../../components/ui/Buttons/SingleButton";
import { toggleNewAppointment } from "../../features/modal/modalSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";

const rowsData = [
  {
    especialidad: "Spicología",
    fechaHora: "23/11/2025 14:00",
    tipoDeCita: "Presencial",
    motivoAsunto: "Consulta",
    estado: "Pendiente",
  },
  {
    especialidad: "Dental",
    fechaHora: "23/11/2025 10:00",
    tipoDeCita: "Presencial",
    motivoAsunto: "Consulta",
    estado: "Pendiente",
  },
  {
    especialidad: "General",
    fechaHora: "23/11/2025 17:00",
    tipoDeCita: "Virtual",
    motivoAsunto: "Consulta",
    estado: "Pendiente",
  },
];

const Appointment = () => {
  const dispatchModal = useAppDispatch();

  const handleButtonShowAppointmentModal = () => {
    dispatchModal(toggleNewAppointment());
  };

  return (
    <>
      <div className={cn("flex justify-end")}>
        <SingleButton onClick={handleButtonShowAppointmentModal}>
          <img className={cn("w-6 h-6")} src={plusIcon} alt="Ícono de más" />
          Agendar nueva cita
        </SingleButton>
      </div>
      <div className={cn("min-h-48 pt-4 ")}>
        <h2 className={cn("h-8", "text-2xl font-bold")}>Mis Citas </h2>
        <div className={cn("w-full mt-2 pt-2", "flex justify-center")}>
          <AppointmentTable rows={rowsData} />
        </div>
      </div>
    </>
  );
};

export default Appointment;
