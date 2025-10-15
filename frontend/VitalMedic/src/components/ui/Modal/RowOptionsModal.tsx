import { cn } from "clsx-for-tailwind";
import { toggleRowOptionsModal } from "../../../features/modal/modalSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import SingleButton from "../Buttons/SingleButton";

const RowOptionsModal = () => {
  const modalDispatch = useAppDispatch();
  const dataRowOptionsModal = useAppSelector(
    (state) => state.modal.rowOptionsModal.data,
  );

  return (
    <div
      className={cn(
        "absolute top-0 leading-0",
        "w-screen h-screen bg-black/15",
        "flex justify-center items-center",
      )}
    >
      <div
        className={cn(
          "w-[350px] h-28 px-2 pb-2 pt-3 bg-white",
          "flex flex-col justify-between",
          "rounded-sm",
          "text-xl font-bold",
        )}
      >
        <h4>{dataRowOptionsModal.especialidad}</h4>

        <div className={cn("flex justify-around ")}>
          <SingleButton variant="secondary">Eliminar</SingleButton>
          <SingleButton
            onClick={() => {
              modalDispatch(toggleRowOptionsModal());
            }}
          >
            Cerrar
          </SingleButton>
        </div>
      </div>
    </div>
  );
};

export default RowOptionsModal;
