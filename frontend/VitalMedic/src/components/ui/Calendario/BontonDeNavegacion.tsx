import { cn } from "clsx-for-tailwind";
import type { BotonDeNavegacionProps } from "./props";

const BontonDeNavegacion = ({ onClick, children }: BotonDeNavegacionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-gray-600 text-2xl font-bold",
        "hover:text-blue-500 transition",
      )}
    >
      {children}
    </button>
  );
};

export default BontonDeNavegacion;
