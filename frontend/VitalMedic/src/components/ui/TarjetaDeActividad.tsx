import { cn } from "clsx-for-tailwind";
import camaraIcon from "../../assets/icons/camara.png";
import locationIcon from "../../assets/icons/location.png";
import SingleButton from "./Buttons/SingleButton";

interface Props {
  titulo: string;
  nombreDeDoctor: string;
  hora: string;
  tipoDeCita?: "Presencial" | "Virtual";
}
const TarjetaDeActividad = ({
  titulo,
  nombreDeDoctor,
  hora,
  tipoDeCita = "Presencial",
}: Props) => {
  return (
    <div
      className={cn(
        "w-72 p-3 min-h-56 bg-white",
        "flex flex-col justify-between",
        "shadow-lg inset-shadow-sm",
        "rounded-2xl",
      )}
    >
      <h4 className={cn("text-xl font-bold")}>{titulo}</h4>
      <h5>{nombreDeDoctor}</h5>
      <div className={cn("w-full mt-3.5", "flex justify-between")}>
        <p>{hora}</p>
        <p
          className={cn(
            "flex items-center gap-1",
            "py-1 px-3",
            "rounded-2xl",
            tipoDeCita === "Virtual" && ["bg-purple-100", "text-purple-800"],
            tipoDeCita === "Presencial" && ["bg-green-100", "text-green-800"],
          )}
        >
          <img
            src={tipoDeCita === "Presencial" ? locationIcon : camaraIcon}
            alt={`Ícono de ${tipoDeCita}`}
          />
          {tipoDeCita}
        </p>
      </div>

      {/* Grupo de botones */}
      <div
        className={cn(
          "w-full mt-3.5",
          "flex justify-center",
          tipoDeCita === "Virtual" && "justify-around",
        )}
      >
        {tipoDeCita === "Virtual" && <SingleButton>Unirme</SingleButton>}
        <SingleButton
          variant="secondary"
          fullWidth={tipoDeCita === "Presencial"}
        >
          Detalles
        </SingleButton>
      </div>
    </div>
  );
};

export default TarjetaDeActividad;
