import { cn } from "clsx-for-tailwind";
import {
  toggleRowOptionsModal,
  updateDataRowOptionsModal,
} from "../../../features/modal/modalSlice";
import { useAppDispatch } from "../../../hooks/reduxHooks";

interface Props {
  especialidad: string;
  fechaHora: string;
  tipoDeCita: string;
  motivoAsunto: string;
  estado: string;
}
const Row = ({
  especialidad,
  fechaHora,
  tipoDeCita,
  motivoAsunto,
  estado,
}: Props) => {
  const dispatchRowOptionsModal = useAppDispatch();

  const handleButtonShowOptiones = () => {
    // rowOptionsModal.setShow(!rowOptionsModal.show);
    dispatchRowOptionsModal(
      updateDataRowOptionsModal({
        especialidad,
        estado,
        fechaHora,
        motivoAsunto,
        tipoDeCita,
      }),
    );
    dispatchRowOptionsModal(toggleRowOptionsModal());
  };
  return (
    <tr className={cn("hover:bg-black/5")}>
      <td>{especialidad}</td>
      <td>{fechaHora}</td>
      <td>{tipoDeCita}</td>
      <td>{motivoAsunto}</td>
      <td>{estado}</td>
      <td className={cn("relative")}>
        <button
          className={cn(
            "py-1 px-1.5",
            "transition-all",
            "border border-[#E5E7EB] rounded-lg",
            "hover:scale-105 hover:border-black/20",
            "active:scale-100",
          )}
          type="button"
          onClick={handleButtonShowOptiones}
        >
          •••
        </button>
        {/*{showOptiones && (
          <div className={cn("absolute right-8 top-12", "z-10")}>
            <button
              className={cn(
                "w-[150px] h-8 bg-white",
                "border-t border-x border-b border-[#E5E7EB] rounded-t-xl",
              )}
              type="button"
            >
              Editar
            </button>
            <button
              className={cn(
                "w-[150px] h-8 bg-white",
                "border-b border-x border-[#E5E7EB] rounded-b-xl",
              )}
              type="button"
            >
              Cancelar
            </button>
          </div>
        )}*/}
      </td>
    </tr>
  );
};

export default Row;
