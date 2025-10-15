import { cn } from "clsx-for-tailwind";
import locationIcon from "../../../assets/icons/location.png";
import SingleButton from "../Buttons/SingleButton";

const AppointmentCard = () => {
  return (
    <div
      className={cn(
        "w-2xs h-56 px-2 my-1.5",
        "grid grid-cols-3 gap-1",
        "inset-shadow-2xs shadow-md rounded-sm",
      )}
    >
      <h3 className={cn("col-span-full self-end", "font-semibold text-xl")}>
        Spicología
      </h3>
      <p className={cn("col-span-full", "text-[#A1A198]")}>
        Dr. Fernanda Mata Sanos
      </p>

      <p className={cn("font-bold", "col-span-2 col-start-1 self-center")}>
        15 Noviembre 2025
      </p>

      <p className={cn("col-span-1  col-end-4 self-center")}>10:30 a.m</p>

      <p
        className={cn(
          "w-fit h-7 px-3.5 py-0.5",
          "bg-[#ECFDF5] rounded-2xl",
          "text-[#047857] font-semibold",
          "col-span-full",
          "flex items-center gap-1",
        )}
      >
        <img
          className={cn("w-5 h-5")}
          src={locationIcon}
          alt="Ícono de ubicación"
        />
        Virtual
      </p>

      <div className={cn("mt-3", "col-span-full", "flex justify-center gap-4")}>
        <SingleButton variant="primary">Meet</SingleButton>
        <SingleButton variant="secondary">Cancelar</SingleButton>
      </div>
    </div>
  );
};

export default AppointmentCard;
