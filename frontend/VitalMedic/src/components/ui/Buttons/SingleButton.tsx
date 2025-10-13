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
  /** Si es true, el botón estará deshabilitado. */
  disabled?: boolean;
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
  disabled = false,
  type = "button",
}: Props) => {
  return (
    <button
      className={cn(
        "py-2 px-4 min-w-[100px] h-10 border",
        "rounded-lg uppercase font-semibold text-[14px] transition-all duration-200",
        !disabled && "shadow-md hover:-translate-y-0.5", // Estilos de interacción/sombra
        fullWidth && "w-full", // Toma el ancho total del padre
        disabled && "opacity-50 cursor-not-allowed", // Estilos para disabled
        {
          // VARIANT: Primary (Blue)
          "bg-blue-600 text-white hover:bg-blue-700 border-blue-600":
            variant === "primary" && !disabled,
          "bg-gray-400 text-white border-gray-400":
            variant === "primary" && disabled,

          // VARIANT: Secondary (Light/Gray)
          "bg-white border-gray-300 text-gray-700 hover:border-gray-800":
            variant === "secondary" && !disabled,
          "bg-gray-100 border-gray-200 text-gray-400":
            variant === "secondary" && disabled,

          // VARIANT: Tertiary (Ghost/Link)
          "bg-transparent border-transparent text-gray-900 shadow-none hover:text-gray-900 hover:scale-110":
            variant === "tertiary" && !disabled,
          "bg-transparent border-transparent text-gray-400 shadow-none":
            variant === "tertiary" && disabled,
        },
      )}
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
};

export default SingleButton;
