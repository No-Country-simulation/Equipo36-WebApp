import { cn } from "clsx-for-tailwind";
import { toggleNewAppointment } from "../../../features/modal/modalSlice";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import SingleButton from "../Buttons/SingleButton";
import DropDownList from "../DropDownList";

const AddAppointmentModal = () => {
  const dispatchAddAppoinmentModal = useAppDispatch();

  return (
    <div
      className={cn(
        "absolute top-0 leading-0",
        "w-screen h-screen bg-black/15",
        "flex justify-center items-center",
      )}
    >
      <div
        className={cn("w-[440px] h-[400px] py-6 px-3 bg-white", "rounded-sm")}
      >
        <h2 className={cn("mb-3", "text-2xl font-bold")}>Nueva cita</h2>
        <form>
          <DropDownList label="Especialidad" />

          <SingleButton
            onClick={() => {
              dispatchAddAppoinmentModal(toggleNewAppointment());
            }}
          >
            Cerrar
          </SingleButton>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
