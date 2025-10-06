import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";

interface Props {
  /**
   * Define la apariencia visual preestablecida del botón.
   * - 'primary': Estilo principal (azul, acción destacada).
   * - 'secondary': Estilo neutro (blanco, acción secundaria).
   * - 'tertiary': Estilo de texto simple (Ghost/Link, bajo perfil).
   */
  children?: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  /** Si es true, el botón ocupará todo el ancho disponible de su contenedor (w-full). */
  fullWidth?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}

/**
 * Componente funcional reusable para renderizar un botón estilizado con Tailwind CSS.
 * Permite seleccionar entre tres variantes visuales y controlar el ancho.
 *
 * @param {Props} props Las propiedades del componente.
 */
const SingleButton = ({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  type = "button",
}: Props) => {
  return (
    <button
      className={cn(
        "py-2 px-4 min-w-[100px] h-10 border",
        "rounded-lg uppercase font-semibold text-[14px] transition-all duration-200",
        "shadow-md hover:-translate-y-0.5", // Estilos de interacción/sombra
        fullWidth && "w-full", // Toma el ancho total del padre
        {
          // VARIANT: Primary (Blue)
          "bg-blue-600 text-white hover:bg-blue-700 border-blue-600":
            variant === "primary",

          // VARIANT: Secondary (Light/Gray)
          "bg-white border-gray-300 text-gray-700 hover:border-gray-800":
            variant === "secondary", // VARIANT: Tertiary (Ghost/Link)
          "bg-transparent border-transparent text-gray-900 shadow-none hover:text-gray-900 hover:scale-110":
            variant === "tertiary",
        },
      )}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SingleButton;
